import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Category.css';

function CommentSection({ productId }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await axios.get(`http://localhost:3003/rate/rate/${productId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                setComments(response.data);
            } catch (error) {
                console.log("Error fetching comments:", error?.message);
            }
        }
        fetchComments();
    }, [productId]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        if (comment) {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const data = {
                userId: localStorage.getItem('userId'), // Lấy ID người dùng từ localStorage
                productId,
                comment,
            };

            try {
                const response = await axios.post('http://localhost:3003/rate/rate', data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200) {
                    setSuccessMessage('Bình luận đã được thêm.');
                    setErrorMessage('');
                    setComment("");
                    setComments((prevComments) => [...prevComments, data]);
                } else {
                    setErrorMessage("Có lỗi xảy ra khi gửi bình luận.");
                    setSuccessMessage('');
                }
            } catch (error) {
                console.log("Error posting comment:", error?.message);
                setErrorMessage("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.");
            }
        } else {
            setErrorMessage("Vui lòng nhập bình luận.");
        }
    };

    return (
        <div className="comment-section">
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    required
                    className="comment-textarea"
                />
                <button type="submit" className="comment-submit-btn">Gửi bình luận</button>
            </form>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="comment-list">
                {Array.isArray(comments) && comments.map((cmt, index) => (
                    <div key={index} className="comment-item">
                        <p>{cmt.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentSection;
