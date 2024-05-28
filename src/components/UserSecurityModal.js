import React, { useState, useEffect } from 'react';
import '../CSS/UserprofileModal.css';

const UserSecurityModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Email:', email, 'Password:', password, 'Location:', location, 'Phone Number:', phoneNumber);
    handleClose(); // Close the modal after submission
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
    <div className="modal fade" id="userSecurityModal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Privacy and Security Details</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="formEmail" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control modal-form-control"
                  id="formEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formPassword" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control modal-form-control"
                  id="formPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formLocation" className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control modal-form-control"
                  id="formLocation"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formPhoneNumber" className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control modal-form-control"
                  id="formPhoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSecurityModal;
