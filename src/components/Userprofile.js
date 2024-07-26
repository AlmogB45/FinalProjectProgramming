import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, setPersistence, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, db } from '../Firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import profileImage from '../assets/userpic.png';
import '../CSS/Userprofile.css';
import UserSecurityModal from './UserSecurityModal';
import UserDetailModal from './UserDetailModal';

function Profile() {
  const [modalType, setModalType] = useState('');
  const [userData, setUserData] = useState(null);

  const handleShowDetail = () => setModalType('detail');
  const handleShowSecurity = () => setModalType('security');
  const handleClose = () => setModalType('');

  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/");
      console.log("Signed out successfully")
    }).catch((error) => {
      console.error("Error signing out:", error);
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        console.log("User is logged out");
        navigate("/");
      }
    });

    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setRememberMe(savedRememberMe);

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'Users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleRememberMeToggle = async () => {
    const newRememberMe = !rememberMe;
    setRememberMe(newRememberMe);
    localStorage.setItem('rememberMe', newRememberMe);

    if (newRememberMe) {
      await setPersistence(auth, browserLocalPersistence);
    } else {
      await setPersistence(auth, browserSessionPersistence);
    }

    // Optionally, update user's preference in Firestore
    if (auth.currentUser) {
      const userDocRef = doc(db, 'Users', auth.currentUser.uid);
      await updateDoc(userDocRef, { rememberMe: newRememberMe });
    }
  };


  return (
    <div className="user-container">
      <Navbar />
      <div className="profile-panel">
        <div className="profile">
          <img src={profileImage} alt="user" />
          <h1>{userData ? `${userData.name}, ${userData.age}` : 'Loading...'}</h1>
          <div className="separatorProfile"></div>
        </div>
        <form>
          <div className="buttons-profile">
            <button className="details" type="button" onClick={handleShowDetail}>Personal Details</button>
            <button className="security" type="button" onClick={handleShowSecurity}>Privacy and Security</button>
            <button onClick={handleLogout} className="logout" type="button">Logout</button>
          </div>
        </form>
      </div>
      <UserDetailModal show={modalType === 'detail'} handleClose={handleClose} userData={userData} />
      <UserSecurityModal show={modalType === 'security'} handleClose={handleClose} userData={userData} />
    </div>
  );
}

export default Profile;
