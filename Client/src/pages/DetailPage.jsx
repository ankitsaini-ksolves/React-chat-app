import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostDetails, clearPostDetails } from "../redux/detailSlice";
import { useParams, useNavigate } from "react-router-dom";
import image from "../assets/free-nature-images.jpg";

const PostDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, loading, error } = useSelector((state) => state.postDetails);

  useEffect(() => {
    dispatch(fetchPostDetails(id));
    return () => {
      dispatch(clearPostDetails());
    };
  }, [dispatch, id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!post) return null;

  return (
    <div className="container mt-5">
      <div className="card">
        <img
          src={image}
          className="card-img-top"
          alt={post.title}
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h2 className="card-title">{post.title}</h2>
          <p className="card-text">{post.description}</p>
          <p>
            <strong>Category:</strong> {post.category}
          </p>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
