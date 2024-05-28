import React, { useState, useEffect } from 'react';

const UserDetailModal = ({ show, handleClose }) => {
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Name:', name, 'Last Name:', lastname, 'Age:', age);
    handleClose(); // Close the modal after submission
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
              <div className="mb-3">
                <label htmlFor="formName" className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control modal-form-control"
                  id="formName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter First Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formLastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control modal-form-control"
                  id="formLastName"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter Last Name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formAge" className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control modal-form-control"
                  id="formAge"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter Age"
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

export default UserDetailModal;
