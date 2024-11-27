import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Header from "./Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('orders');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3003/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === 200) {
          setUser(response.data);
        } else {
          console.error('Failed to fetch user profile:', response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
    <Header />
    <div className="profile-container">
      <div className="profile-sidebar">
        <h2>Xin chào, {user ? user.username : 'User'}</h2>
        <button
          onClick={() => handleTabChange('orders')}
          className={`tab-button ${selectedTab === 'orders' ? 'active' : ''}`}
        >
          Đơn hàng đã mua
        </button>
        <button
          onClick={() => handleTabChange('info')}
          className={`tab-button ${selectedTab === 'info' ? 'active' : ''}`}
        >
          Thông tin cá nhân
        </button>
        <button onClick={handleLogout} className="logout-button">
          Đăng xuất
        </button>
      </div>
      <div className="profile-content">
        {selectedTab === 'orders' ? (
          <div className="orders-content">
          <h2>Đơn hàng đã mua</h2>
          <div className="order-filters">
            <button className="filter-button">Tất cả</button>
            <button className="filter-button">Chờ xác nhận</button>
            <button className="filter-button">Đang giao hàng</button>
            <button className="filter-button">Đã giao</button>
          </div>
          <div className="order-empty">
          <RemoveShoppingCartIcon style={{ fontSize: '100px', color: '#d32f2f', marginBottom: '10px' }} />
            <p>Rất tiếc, không tìm thấy đơn hàng nào phù hợp</p>
            <span>Vẫn còn rất nhiều sản phẩm đang chờ bạn</span>
            <div className="product-suggestions">
              <button onClick={() => navigate('/products?category=1')}>Điện thoại</button>
              <button onClick={() => navigate('/products?category=2')}>Máy tính bảng</button>
              <button onClick={() => navigate('/products?category=3')}>Laptop</button>
              <button onClick={() => navigate('/products?category=5')}>Máy tính để bàn</button>
              <button onClick={() => navigate('/products?category=6')}>Máy in</button>
              <button onClick={() => navigate('/products?category=7')}>Máy ảnh</button>
              <button onClick={() => navigate('/products?category=4')}>Đồng hồ</button>
            </div>
            <button className="back-home-button"  onClick={() => navigate('/')}>Về trang chủ</button>
          </div>
        </div>
        ) : (
          <div className="info-content">
            <h2>Thông tin cá nhân</h2>
            <p>Tên: {user ? user.username : 'N/A'}</p>
            <p>Email: {user ? user.email : 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Profile;
