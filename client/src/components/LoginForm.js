import React, { useState } from 'react';
import { SERVER_HOST } from '../config/global_constants';

export const LoginForm = props => {
  const { setIsLoggedIn, setUser, setShowLogin, fetchCart, setSuccessMessage, setErrorMessage } = props;

  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginData.email || !loginData.password) {
      setErrorMessage('Email and password are required');
      return;
    }
    try {
      const res = await fetch(`${SERVER_HOST}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setUser(data.user);
        setShowLogin(false);
        setSuccessMessage('Login successful!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCart();
      } else {
        setErrorMessage(data.error || 'Login failed');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="af_formContainer">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} required />
        <input type="password" placeholder="Password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} required />
        <button className="af_btn" type="submit">Login</button>
        <button className="af_btn af_btnSecondary" type="button" onClick={() => setShowLogin(false)}>Cancel</button>
      </form>
    </div>
  );
};
