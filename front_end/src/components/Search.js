import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid2 } from '@mui/material';
import Header from './Navbar';


const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results } = location.state || { results: [] };

  const handleAddToCart = async (productId) => {
    if (productId !== null) {
      const data = {
        userId: "672d6eea5d8c6f7abb9452f7",  // Lấy userId từ localStorage hoặc Redux
        productId,
        quantity: 1,
      };

      try {
        const response = await axios.post(`http://localhost:3003/cart/addproduct_cart`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          alert('Thêm vào giỏ hàng thành công');
          navigate('/cart');
        }
      } catch (error) {
        console.log(error?.message);
      }
    }
  };
  return (
    <div>
      <Header /> 
      <div className="search-results-page">
        <h2>Kết quả tìm kiếm</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {results.length > 0 ? (
            results.map((product) => (
              <div key={product._id} className="product-container" style={{ width: '250px', textAlign: 'center' }}>
                <img
                  src={product.image_product}
                  alt={product.name_product}
                  className="product-image"
                  style={{ width: '100%', height: 'auto' }}
                />
                <p className="product-name">{product.name_product}</p>
                <p className="product-price">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <Grid2
                className="add-to-cart-btn"
                onClick={(event) => {
                  event.stopPropagation();  
                  handleAddToCart(product._id); 
                }}
              >
                Thêm vào giỏ
              </Grid2>
              </div>
            ))
          ) : (
            <div>Không tìm thấy sản phẩm nào.</div>
          )}
        </div>
      </div>
    </div>
  );
};



export default SearchResultsPage;
