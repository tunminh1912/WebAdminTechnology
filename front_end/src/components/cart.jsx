/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Navbar";

function Cart() {
  const [cartProducts, setcartProducts] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await axios.get(
          "http://localhost:3003/cart/672d6eea5d8c6f7abb9452f7"
        );
        if (response.status === 200) setcartProducts(response.data?.products);
      } catch (error) {
        alert(`Lỗi khi hiển thị sản phẩm trong giỏ hàng: ${error}`);
      }
    }
    fetchCart();
  }, []);

  const [selectedProducts, setSelectProducts] = useState([]);

  const handleSelectProduct = (product) => {
    if (
      selectedProducts.some(
        (item) => item.productId._id === product.productId._id
      )
    ) {
      const nextProductList = selectedProducts.filter(
        (productItem) => productItem.productId._id !== product.productId._id
      );
      setSelectProducts(nextProductList);
    } else {
      setSelectProducts([...selectedProducts, product]);
    }
  };

  function totalMonney(productList) {
    return productList.reduce(
      (total, product) => total + product?.productId?.price * product.quanlity,
      0
    );
  }

  return (
    <><Header /><div>
      <div style={{ display: "flex" }}>
        <ul>
          <h2>Giỏ hàng</h2>
          <table>
            <tbody>
              {cartProducts?.length > 0 ? (
                cartProducts.map((product, key) => (
                  <tr className="cart-product">
                    <td style={{ padding: "10px" }}>
                      <input
                        type="checkbox"
                        className="checkbox"
                        size="large"
                        onChange={() => handleSelectProduct(product)}
                        checked={selectedProducts?.includes(product)}
                      ></input>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <img
                        src={product?.productId.image_product}
                        alt={product?.productId.name_product}
                        style={{ width: "100px" }}
                      ></img>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "18px",
                          fontWeight: "bold",
                          width: "400px",
                        }}
                      >
                        {product?.productId.name_product}
                      </p>
                      {/* <span style={{ fontSize: "12px", color: "gray" }}>
                  {product?.productId.brand}
                </span> */}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        color: "green",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      {product?.productId.price}
                    </td>
                    <td style={{ padding: "10px" }}>
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          fontSize: "18px",
                        }}
                      >
                        -
                      </button>
                      <span style={{ margin: "0 10px", fontSize: "18px" }}>
                        {product?.quanlity}
                      </span>
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          fontSize: "18px",
                        }}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      <p>Xóa</p>
                    </td>
                  </tr>
                ))
              ) : (
                <> Giỏ hàng trống</>
              )}
            </tbody>
          </table>
        </ul>
        <ul>
          <h2>Các sản phẩm đã chọn</h2>
          <table>
            <tbody>
              {selectedProducts?.length > 0 ? (
                selectedProducts.map((product) => (
                  <tr>
                    <td style={{ padding: "10px" }}>
                      <img
                        src={product?.productId.image_product}
                        alt={product?.productId.name_product}
                        style={{ width: "75px" }}
                      ></img>
                    </td>
                    <td>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: "bold",
                          width: "250px",
                        }}
                      >
                        {product?.productId.name_product}
                      </p>
                      {/* <span style={{ fontSize: "10px", color: "gray" }}>
                  {product?.productId.brand}
                </span> */}
                    </td>
                    <td>
                      <p
                        style={{
                          textAlign: "center",
                          color: "green",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {product?.productId.price}
                      </p>
                      <span>SL: {product?.quanlity}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <>Chưa có sản phẩm được chọn</>
              )}
            </tbody>
          </table>
          <h3>Tổng số tiền: {totalMonney(selectedProducts)}</h3>
        </ul>
      </div>
    </div></>
  );
}

export default Cart;
