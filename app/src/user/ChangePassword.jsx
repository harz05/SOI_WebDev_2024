import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChangePassword.css';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email) {
      setEmail(storedUser.email);
    }
  }, []);

  const handleChangePassword = async () => {
    if (newPassword.length < 8 || newPassword.length > 15) {
      console.log('Password must be between 8 and 15 characters.');
      return;
    }

    if (newPassword === confirmPassword) {
      try {
        const response = await axios.patch('https://localhost:3000/change-password', {
          email,
          newPassword,
        });
        console.log(response.data.message);
        alert('Password changed successfully');
      } catch (error) {
        console.error(error.response.data.message);
        alert('An error occurred. Please try again.');
      }
    } else {
      console.log('Passwords do not match');
      alert('Passwords do not match');
    }
  };

  return (
    <div className="change-password-container">
      <div className="change-password">
        <h2>Change Password</h2>
        <p>Hints on getting your new password right:</p>
        <p>Your new password must be between 8 and 15 characters in length.</p>
        <form onSubmit={e => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn" onClick={handleChangePassword}>
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
