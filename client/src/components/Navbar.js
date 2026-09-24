import React from 'react';

export const Navbar = props => {
  const { cart, isLoggedIn, user, setShowCart, setPage, setShowOrders, setShowLogin, setShowRegister, setIsLoggedIn, setUser, setCart, setSuccessMessage } = props;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    setCart({ items: [] });
    setSuccessMessage('Logged out');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <nav>
      <h1>🧱 Lego Store</h1>
      <div>
        <a href="#" onClick={() => { setShowCart(false); setPage('home'); setShowOrders(false); setShowLogin(false); setShowRegister(false); }}>Products</a>
        {!isAdmin && (
          <a href="#" onClick={() => { setShowCart(true); setShowOrders(false); setShowLogin(false); setShowRegister(false); setPage('home'); }}>Cart ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</a>
        )}
        {isLoggedIn && (
          <>
            {!isAdmin && (
              <a href="#" onClick={() => { setShowOrders(true); setShowCart(false); setPage('orders'); }}>My Orders</a>
            )}
            <a href="#" onClick={() => { setPage('profile'); setShowCart(false); setShowOrders(false); }}>Profile</a>
            {isAdmin && (
              <a href="#" onClick={() => { setPage('admin'); setShowCart(false); setShowOrders(false); }}>Admin</a>
            )}
            <a href="#" onClick={handleLogout}>Logout</a>
          </>
        )}
        {!isLoggedIn && (
          <>
            <a href="#" onClick={() => { setShowLogin(true); setShowRegister(false); }}>Login</a>
            <a href="#" onClick={() => { setShowRegister(true); setShowLogin(false); }}>Register</a>
          </>
        )}
      </div>
    </nav>
  );
};