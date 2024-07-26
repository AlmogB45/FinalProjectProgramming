import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const UserDetailModal = ({ show, handleClose, userData }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setAge(userData.age || '');
      setCity(userData.city || '');
    }
  }, [userData]);

  useEffect(() => {
    const modalElement = document.getElementById('userDetailModal');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'Users', user.uid), {
          name: name,
          age: age,
          city: city
        });
        console.log('User details updated successfully');
      }
    } catch (error) {
      console.error('Error updating user details:', error);
    }
    handleClose();
  };


  useEffect(() => {
    const modalElement = document.getElementById('userDetailModal');
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
    <div className="modal fade" id="userDetailModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Personal Details</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Age:
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
              </label>
              <label>
                City:
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              </label>
              <button type="submit">Save Changes</button>
            </form>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
