import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, deletePost } from "../redux/postSlice";
import image from "../assets/free-nature-images.jpg";
import { debounce } from "lodash";
import Modal from "../components/Modal";
import { toggleModal } from "../redux/modalSlice";
import { toast } from "react-toastify";
import "../App.css";
import { Link } from "react-router-dom";

const PostPage = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.posts);
  const { isModalOpen, modalType, currentPost } = useSelector(
    (state) => state.modal
  );
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setSearchTerm(searchValue);
    }, 1000),
    []
  );

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setInputValue("");
  };

  const filteredPost = posts.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShowModal = (type, post) => {
    dispatch(toggleModal({ type, post }));
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch(deletePost(postId));
        toast.info("Deleted Successfully", { autoClose: 2000 });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to delete the post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to the server");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="container mt-4">
      <div className="flex input-group mb-3" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search for posts..."
          className="form-control"
          value={inputValue}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <span
            onClick={handleClearSearch}
            className="clear-icon"
            style={{ cursor: "pointer" }}
          >
            <i className="mdi mdi-close-circle-outline mdi-24px mdi-dark mdi-inactive"></i>
          </span>
        )}
        <button
          className="btn btn-primary"
          onClick={() => handleShowModal("add")}
        >
          Add
        </button>
      </div>

      <h2 className="text-center">Posts</h2>
      <div className="row">
        {filteredPost.length > 0 ? (
          filteredPost.map((post) => (
            <div className="col-md-4" key={post.id}>
              <div className="card mb-4">
                <img src={image} className="card-img-top" alt={post.title} />
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                  <p className="text-muted">Category: {post.category}</p>
                  <button
                    onClick={() =>
                      dispatch(toggleModal({ type: "edit", post }))
                    }
                    className=" m-1 btn btn-warning"
                  >
                    Edit
                  </button>
                  <span onClick={() => handleDelete(post.id)}>
                    <i className="mdi mdi-delete mdi-24px mdi-dark"></i>
                  </span>
                  <Link to={`/posts/${post.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
      {isModalOpen && (
        <Modal
          handleClose={() => dispatch(toggleModal())}
          userId={user.id}
          modalType={modalType}
          currentPost={currentPost}
        />
      )}
    </div>
  );
};

export default PostPage;
