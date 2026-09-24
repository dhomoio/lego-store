import React, { useState } from 'react';
import { SERVER_HOST } from '../config/global_constants';

export const RegisterForm = props => {
  const { setIsLoggedIn, setUser, setShowRegister, fetchCart, setSuccessMessage, setErrorMessage } = props;

  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!registerData.name || !registerData.email || !registerData.password) {
      setErrorMessage('All fields are required');
      return;
    }
    if (registerData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    try {
      const res = await fetch(`${SERVER_HOST}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        setUser(data.user);
        setShowRegister(false);
        setSuccessMessage('Registration successful!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCart();
      } else {
        setErrorMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="af_formContainer">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Name" value={registerData.name} onChange={e => setRegisterData({...registerData, name: e.target.value})} required />
        <input placeholder="Email" value={registerData.email} onChange={e => setRegisterData({...registerData, email: e.target.value})} required />
        <input type="password" placeholder="Password (min 6 chars)" value={registerData.password} onChange={e => setRegisterData({...registerData, password: e.target.value})} required />
        <button className="af_btn" type="submit">Register</button>
        <button className="af_btn af_btnSecondary" type="button" onClick={() => setShowRegister(false)}>Cancel</button>
      </form>
    </div>
  );
};
