import React, { useState, useEffect } from 'react';
import { SERVER_HOST } from '../config/global_constants';

export const OrdersPage = props => {
  const { setShowOrders, setPage, setErrorMessage } = props;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${SERVER_HOST}/api/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
        setErrorMessage(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setOrders([]);
      setErrorMessage('Error fetching orders');
    }
  };

  return (
    <div>
      <h2>My Orders</h2>
      <button className="af_btn af_btnSecondary" onClick={() => { setShowOrders(false); setPage('home'); }}>Back to Products</button>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="af_productCard">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Total:</strong> ${order.totalAmount}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Items:</strong> {order.items?.length || 0}</p>
          </div>
        ))
      )}
    </div>
  );
};
