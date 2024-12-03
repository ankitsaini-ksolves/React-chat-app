const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (emailCheck.rows.length > 0) {
    return res.status(400).json({ error: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    const newUser = result.rows[0];
    res.status(201).json({ id: newUser.id, username: newUser.username, email: newUser.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query("SELECT id, username, email, password FROM users WHERE email = $1", [email]);
  
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });
  
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid password" });
  
    const token = jwt.sign({ id: user.id, username: user.username }, "secret_key");
    res.json({
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
});

app.get("/messages/:roomId", async (req, res) => {
    const { roomId } = req.params;
    try {
        const result = await pool.query(
            "SELECT m.message, m.created_at, u.username FROM messages m JOIN users u ON m.user_id = u.id WHERE chat_room_id = $1 ORDER BY m.created_at ASC",
            [roomId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching messages");
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
        const { roomId, userId, message, username } = data;

        try {
            await pool.query(
                "INSERT INTO messages (chat_room_id, user_id, message) VALUES ($1, $2, $3)",
                [roomId, userId, message]
            );

            io.to(roomId).emit("receiveMessage", {
                roomId,
                userId,
                message,
                username,
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


