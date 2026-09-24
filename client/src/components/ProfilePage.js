import React, { useState, useEffect } from 'react';
import { SERVER_HOST } from '../config/global_constants';

export const ProfilePage = props => {
  const { user, setUser, setPage, setSuccessMessage, setErrorMessage } = props;

  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (user) setEditName(user.name || '');
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!editName.trim()) {
      setErrorMessage('Name is required');
      return;
    }
    try {
      const res = await fetch(`${SERVER_HOST}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setSuccessMessage('Profile updated!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="af_profileSection">
      <h2>My Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <input value={editName} onChange={e => setEditName(e.target.value)} required />
        <button className="af_btn" type="submit">Save Name</button>
      </form>
      <p>{user?.email}</p>
      <p>Role: {user?.role}</p>
      <button className="af_btn af_btnSecondary" onClick={() => setPage('home')}>Back</button>
    </div>
  );
};
