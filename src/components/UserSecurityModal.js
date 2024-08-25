import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase/config';
import { updateEmail, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import '../CSS/UserModals.css';

const UserSecurityModal = ({ show, handleClose, userData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (userData) {
      setEmail(userData.email || '');
      setPhoneNumber(userData.phone || '');
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        if (email !== userData.email) {
          await updateEmail(user, email);
        }
        if (password) {
          await updatePassword(user, password);
        }
        await updateDoc(doc(db, 'Users', user.uid), {
          email: email,
          phone: phoneNumber
        });
        console.log('User data updated successfully');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
    handleClose();
  };

  useEffect(() => {
    const modalElement = document.getElementById('userSecurityModal');
    if (show) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      document.body.classList.add('modal-open');
    } else {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }, [show]);

  return (
    <div className={`user-modal ${show ? 'show' : ''}`} id="userSecurityModal">
      <div className="user-modal-content">
        <div className="user-modal-header">
          <h5 className="user-modal-title">Edit Privacy and Security Details</h5>
          <button className="user-modal-close" onClick={handleClose}>&times;</button>
        </div>
        <form className="user-modal-form" onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            New Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label>
            Phone Number:
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </label>
          <button type="submit" className="user-modal-submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default UserSecurityModal;
