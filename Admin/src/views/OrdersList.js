import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);


  useEffect(() => {
    axios.get('http://localhost:3003/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the orders!', error);
      });
  }, []);

  const handleOrderClick = (orderId) => {
    axios.get(`http://localhost:3003/orders/${orderId}/details`)
      .then(response => {
        setSelectedOrderDetails(response.data); 
      })
      .catch(error => {
        console.error('There was an error fetching the order details!', error);
      });
  };

  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => {
    return sum + (parseInt(order.TotalAmount) || 0); 
  }, 0);

  return (
    <div>
      <h2>Orders List</h2>
      <div style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        <p>Total Orders: {totalOrders}</p>
        <p>Total Amount: {totalAmount.toLocaleString('vi-VN')} VND</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order Code</th>
            <th>User ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id} onClick={() => handleOrderClick(order._id)}>
                <td>{order.OrderCode}</td>
                <td>{order.userId?.username || order.userId}</td>
                <td>{new Date(order.OrderDate).toLocaleString()}</td>
                <td>{order.TotalAmount}</td>
                <td>{order.Status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedOrderDetails && (
        <div>
          <h3>Order Details</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrderDetails.map((detail) => (
                <tr key={detail._id}>
                  <td>{detail.name_product}</td>
                  <td>{detail.price}</td>
                  <td>{detail.quantity}</td>
                  <td>{detail.TotalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
