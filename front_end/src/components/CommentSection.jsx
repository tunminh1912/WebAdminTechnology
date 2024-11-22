import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa'; // Import biểu tượng sao từ react-icons
import { useNavigate } from 'react-router-dom';
import './Category.css';

function CommentSection({ productId }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0); // Giữ trạng thái rating
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Lấy danh sách bình luận từ server
    useEffect(() => {
        async function fetchComments() {
            try {
                const response = await axios.get(`http://localhost:3003/rate/rate/${productId}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (Array.isArray(response.data)) {
                    setComments(response.data); // Set comments nếu là mảng
                }
            } catch (error) {
                console.log("Error fetching comments:", error?.message);
            }
        }
        fetchComments();
    }, [productId]); // Khi productId thay đổi, fetch lại bình luận

    // Xử lý khi người dùng gửi bình luận
    const handleCommentSubmit = async (event) => {
        event.preventDefault();
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập để bình luận.');
            navigate('/login');
            return;
        }
    
        if (comment && rating) {
            const data = {
                userId: localStorage.getItem('userId'),
                productId,
                comment,
                rating,
            };
    
            try {
                const response = await axios.post('http://localhost:3003/rate/rate', data, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                if (response.status === 200 && response.data.rate) {
                    alert('Bình luận thành công!');
                    window.location.reload(); // Load lại trang sau khi bấm đóng alert
                } else {
                    setErrorMessage("Có lỗi xảy ra khi gửi bình luận.");
                    setSuccessMessage('');
                }
            } catch (error) {
                console.log("Error posting comment:", error?.message);
                setErrorMessage("Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại.");
            }
        } else {
            setErrorMessage("Vui lòng nhập bình luận và đánh giá sao.");
        }
    };    

    // Xử lý đánh giá sao
    const handleRatingChange = (ratingValue) => {
        setRating(ratingValue);
    };

    // Xử lý việc xóa bình luận
    const handleDeleteComment = async (commentId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.delete(`http://localhost:3003/rate/rate/${commentId}`, {
                data: { userId },
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
                setSuccessMessage("Đã xóa bình luận.");
            } else {
                setErrorMessage("Không thể xóa bình luận.");
            }
        } catch (error) {
            console.log("Error deleting comment:", error?.message);
            setErrorMessage("Có lỗi xảy ra khi xóa bình luận.");
        }
    };

    return (
        <div className="comment-section">
            <p style={{ fontWeight: 'bold', fontSize: '23px' }}>ĐÁNH GIÁ SẢN PHẨM</p>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    required
                    className="comment-textarea"
                />
                <div className="rating-container">
                    <label>Đánh giá sao: </label>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <FaStar
                                key={value}
                                onClick={() => handleRatingChange(value)}
                                className={`star ${rating >= value ? 'filled' : ''}`}
                            />
                        ))}
                    </div>
                </div>
                <button type="submit" className="comment-submit-btn">Gửi bình luận</button>
            </form>

            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="comment-list">
                {comments.map((cmt) => (
                    <div key={cmt._id} className="comment-item">
                        <p><strong>{cmt.userId.username || 'Người dùng'}:</strong> {cmt.comment}</p>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <FaStar
                                    key={value}
                                    className={`star ${cmt.rating >= value ? 'filled' : ''}`}
                                />
                            ))}
                        </div>
                        {cmt.userId._id === localStorage.getItem('userId') && (
                            <button className="delete-comment-btn" onClick={() => handleDeleteComment(cmt._id)}>
                                Xóa
                            </button>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
}

export default CommentSection;
