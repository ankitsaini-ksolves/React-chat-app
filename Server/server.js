import express from "express";
import {Server} from 'socket.io'
import {createServer} from 'http'
import cors from 'cors'
import dotenv from 'dotenv';
import pg from 'pg'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


io.on("connection", (socket)=>{
    console.log("User Connected");
})

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

app.post("/posts", async (req, res) => {
    const { title, description, category, user_id } = req.body;
  
    if (!title || !description || !category || !user_id) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }
  
    try {
      const result = await pool.query(
        "INSERT INTO posts (title, description, category, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, description, category, user_id]
      );
      const newPost = result.rows[0];
      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error saving post' });
    }
});
  
  
app.get("/posts", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
      const posts = result.rows;
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching posts" });
    }
});
  
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const query = `
        SELECT posts.*, users.username 
        FROM posts 
        JOIN users ON posts.user_id = users.id 
        WHERE posts.id = $1
      `;
      const result = await pool.query(query, [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching post details:', err);
      res.status(500).json({ error: 'Failed to fetch post details' });
    }
});  

app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, category } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE posts SET title = $1, description = $2, category = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [title, description, category, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update the post' });
    }
});

app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received DELETE request for id:', id);
  
    try {
      const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.status(200).json({ message: 'Post deleted successfully', post: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete the post' });
    }
});

const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


