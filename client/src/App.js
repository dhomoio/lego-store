import React, { useState, useEffect } from 'react';
import './css/App.css';
import { SERVER_HOST } from './config/global_constants';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ProfilePage } from './components/ProfilePage';
import { AdminPage } from './components/AdminPage';
import { OrdersPage } from './components/OrdersPage';
import { CartView } from './components/CartView';
import { ProductsPage } from './components/ProductsPage';

export const App = props => {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [] });
  const [showCart, setShowCart] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [page, setPage] = useState('home');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    checkToken();
    setLoading(false);
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile();
      fetchCart();
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SERVER_HOST}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (err) {}
  };

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${SERVER_HOST}/api/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
      }
    } catch (err) {
      setErrorMessage('Failed to load cart');
    }
  };

  const addToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please login to add items to your cart');
      return;
    }
    try {
      const res = await fetch(`${SERVER_HOST}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
        setSuccessMessage(`${product.name} added to cart!`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to add item to cart');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SERVER_HOST}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity })
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
      } else {
        setErrorMessage(data.error || 'Failed to update cart');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  const removeCartItem = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${SERVER_HOST}/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
      } else {
        setErrorMessage(data.error || 'Failed to remove item');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  const checkout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please login first');
      return;
    }
    try {
      const res = await fetch(`${SERVER_HOST}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Order placed successfully!');
        fetchCart();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.error || 'Checkout failed');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  if (loading) {
    return <div className="af_container"><h1>Loading...</h1></div>;
  }

  return (
    <div>
      <Navbar
        cart={cart}
        isLoggedIn={isLoggedIn}
        user={user}
        setShowCart={setShowCart}
        setPage={setPage}
        setShowOrders={setShowOrders}
        setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
        setCart={setCart}
        setSuccessMessage={setSuccessMessage}
      />

      <div className="af_container">
        {errorMessage && <div className="af_errorMessage">{errorMessage}</div>}
        {successMessage && <div className="af_successMessage">{successMessage}</div>}

        {showLogin && (
          <LoginForm
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
            setShowLogin={setShowLogin}
            fetchCart={fetchCart}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {showRegister && (
          <RegisterForm
            setIsLoggedIn={setIsLoggedIn}
            setUser={setUser}
            setShowRegister={setShowRegister}
            fetchCart={fetchCart}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {page === 'profile' && isLoggedIn && (
          <ProfilePage
            user={user}
            setUser={setUser}
            setPage={setPage}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {page === 'admin' && isLoggedIn && user?.role === 'admin' && (
          <AdminPage
            setPage={setPage}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {showOrders && (
          <OrdersPage
            setShowOrders={setShowOrders}
            setPage={setPage}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}

        {showCart ? (
          <CartView
            cart={cart}
            updateCartQuantity={updateCartQuantity}
            removeCartItem={removeCartItem}
            checkout={checkout}
            setShowCart={setShowCart}
          />
        ) : page === 'home' && (
          <ProductsPage
            addToCart={addToCart}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>
    </div>
  );
};
