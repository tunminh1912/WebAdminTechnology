import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Navbar";
import './Cart.css'; // Import file CSS

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await axios.get(
          "http://localhost:3003/cart/672d6eea5d8c6f7abb9452f7"
        );
        if (response.status === 200) setCartProducts(response.data?.products);
      } catch (error) {
        alert(`Lỗi khi hiển thị sản phẩm trong giỏ hàng: ${error}`);
      }
    }
    fetchCart();
  }, []);

  const [selectedProducts, setSelectProducts] = useState([]);

  const handleSelectProduct = (product) => {
    const isSelected = selectedProducts.some(
      (item) => item.productId._id === product.productId._id
    );
    
    if (isSelected) {
      const nextProductList = selectedProducts.filter(
        (productItem) => productItem.productId._id !== product.productId._id
      );
      setSelectProducts(nextProductList);
    } else {
      setSelectProducts([...selectedProducts, product]);
    }
  };

  function totalMoney(productList) {
    return productList.reduce(
      (total, product) => total + product?.productId?.price * product.quanlity,
      0
    );
  }

  const handlePayment = () => {
    if (selectedProducts.length > 0) {
      // Điều hướng người dùng đến trang thanh toán, có thể truyền dữ liệu sản phẩm
    } else {
      alert("Bạn chưa chọn sản phẩm để thanh toán!");
    }
  };

  const handleRemoveProduct = (product) => {
    const nextProductList = cartProducts.filter(
      (item) => item.productId._id !== product.productId._id
    );
    setCartProducts(nextProductList);
  };

  return (
    <>
      <Header />
      <div className="cart-container">
        <ul className="cart-table">
          <h2>Giỏ hàng</h2>
          <table>
            <tbody>
              {cartProducts?.length > 0 ? (
                cartProducts.map((product, key) => (
                  <tr className="cart-product" key={key}>
                    <td>
                      <input
                        type="checkbox"
                        className="checkbox"
                        size="large"
                        onChange={() => handleSelectProduct(product)}
                        checked={selectedProducts.some(
                          (item) => item.productId._id === product.productId._id
                        )}
                      />
                    </td>
                    <td>
                      <img
                        src={product?.productId.image_product}
                        alt={product?.productId.name_product}
                      />
                    </td>
                    <td>
                      <p>{product?.productId.name_product}</p>
                    </td>
                    <td>
                      <p>{product?.productId.price}</p>
                    </td>
                    <td>
                      <button>-</button>
                      <span>{product?.quanlity}</span>
                      <button>+</button>
                    </td>
                    <td>
                      <p className="remove" onClick={() => handleRemoveProduct(product)}>
                        Xóa
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <>Giỏ hàng trống</>
              )}
            </tbody>
          </table>
        </ul>
        <ul className="selected-products-table">
          <h2>Các sản phẩm đã chọn</h2>
          <table>
            <tbody>
              {selectedProducts?.length > 0 ? (
                selectedProducts.map((product, key) => (
                  <tr key={key}>
                    <td>
                      <img
                        src={product?.productId.image_product}
                        alt={product?.productId.name_product}
                      />
                    </td>
                    <td>
                      <p>{product?.productId.name_product}</p>
                    </td>
                    <td>
                      <p>{product?.productId.price}</p>
                      <span>SL: {product?.quanlity}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <>Chưa có sản phẩm được chọn</>
              )}
            </tbody>
          </table>
          <h3 className="total-money">Tổng số tiền: {totalMoney(selectedProducts)}</h3>
          {selectedProducts.length > 0 && (
            <button className="payment-button" onClick={handlePayment}>
              Thanh toán
            </button>
          )}
        </ul>
      </div>
    </>
  );
}

export default Cart;
