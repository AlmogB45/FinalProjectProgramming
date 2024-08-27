import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signOut, setPersistence, browserSessionPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, db, storage } from '../Firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultProfileImage from '../assets/userpic.png';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../CSS/Userprofile.css';
import UserSecurityModal from './UserSecurityModal';
import UserDetailModal from './UserDetailModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [modalType, setModalType] = useState('');
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const fileInputRef = useRef(null);

  const handleShowDetail = () => setModalType('detail');
  const handleShowSecurity = () => setModalType('security');
  const handleClose = () => setModalType('');

  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate("/");
      toast.success("Signed out successfully")
    }).catch((error) => {
      toast.error("Error signing out:", error);
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        toast.info("User is logged out");
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
        const userDataFromFirestore = userDocSnap.data();
        setUserData(userDataFromFirestore);
        if (userDataFromFirestore && userDataFromFirestore.profileImageUrl) {
          setProfileImage(userDataFromFirestore.profileImageUrl);
        } else {
          setProfileImage(defaultProfileImage);
        }
      } else {
        toast.error("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = doc(db, 'Users', auth.currentUser.uid);
      await updateDoc(userDocRef, { profileImageUrl: downloadURL });

      setProfileImage(downloadURL);
      toast.success("Profile image updated successfully!");
    } catch (error) {
      toast.error("Error uploading image:", error);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
          <div className="profile" onClick={triggerFileInput}>
            <img src={profileImage} alt="user" className="profile-img" />
            <div className="image-overlay">
              <span id="usertip">Tip: Click image to change! </span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <h1>{userData ? `${userData.username}, ${userData.age}` : 'Loading...'}</h1>
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
