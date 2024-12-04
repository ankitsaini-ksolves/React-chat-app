import React, { useState, useEffect } from 'react';
import {addPost, updatePost} from '../redux/postSlice'
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";


const Modal = ({ handleClose, userId, modalType, currentPost }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (modalType === 'edit' && currentPost) {
      setTitle(currentPost.title);
      setDescription(currentPost.description);
      setCategory(currentPost.category);
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
    }
  }, [modalType, currentPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(modalType === 'edit' ? `http://localhost:5000/posts/${currentPost.id}` : 'http://localhost:5000/posts', {
        method: modalType === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (modalType === 'edit') {
            dispatch(updatePost(data));
            toast.success("Post updated successfully!",{autoClose: 2000});

          } else {
            dispatch(addPost(data));
            toast.success("Post added successfully!");

          }
          handleClose();
        } else {
          setError(data.error || 'Error saving the post');
        }
    } catch (err) {
      setError('Error in connecting the server');
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{modalType === 'edit' ? 'Edit Post' : 'Add New Post'}</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {modalType === 'edit' ? 'Update Post' : 'Add Post'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
