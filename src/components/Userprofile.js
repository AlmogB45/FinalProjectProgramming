import React, { useState } from "react";
import Navbar from '../components/Navbar';
import profileImage from '../assets/userpic.png';
import '../CSS/Userprofile.css';
import UserSecurityModal from './UserSecurityModal';
import UserDetailModal from './UserDetailModal';

function Profile() {
  const [modalType, setModalType] = useState('');

  const handleShowDetail = () => setModalType('detail');
  const handleShowSecurity = () => setModalType('security');
  const handleClose = () => setModalType('');

  return (
    <div className="user-container">
      <Navbar />
      <div className="profile-panel">
        <div className="profile">
          <img src={profileImage} alt="user" />
          <h1>User, 23</h1>
          <div className="separatorProfile"></div>
        </div>
        <form>
          <div className="buttons-profile">
            <button className="details" type="button" onClick={handleShowDetail}>Personal Details</button>
            <button className="security" type="button" onClick={handleShowSecurity}>Privacy and Security</button>
            <button className="logout" type="button">Logout</button>
          </div>
        </form>
      </div>
      <UserDetailModal show={modalType === 'detail'} handleClose={handleClose} />
      <UserSecurityModal show={modalType === 'security'} handleClose={handleClose} />
    </div>
  );
}

export default Profile;
