import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import fetchCities from '../utils/cityApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/UserModals.css';

const UserDetailModal = ({ show, handleClose, userData }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [citiesList, setCitiesList] = useState([]);

  // Handle update of details 
  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setAge(userData.age || '');
      setCity(userData.city || '');

    }
  }, [userData]);

  // Handle the submit 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'Users', user.uid), {
          name: name,
          age: age,
          city: city
        });
        toast.success('User details updated successfully');
      }
    } catch (error) {
      toast.error('Error updating user details:', error);
    }
    handleClose();
  };

  // Fetch the cities from API
  useEffect(() => {
    const fetchCitiesData = async () => {
      try {
        const cities = await fetchCities();
        setCitiesList(cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCitiesData();
  }, []);

  // Handle the modal display states
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
    <div className={`user-modal ${show ? 'show' : ''}`} id="userDetailModal">
      <div className="user-modal-content">
        <div className="user-modal-header">
          <h5 className="user-modal-title">Edit Personal Details</h5>
          <button className="user-modal-close" onClick={handleClose}>&times;</button>
        </div>
        <form className="user-modal-form" onSubmit={handleSubmit}>
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
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select a city</option>
              {citiesList.map((cityItem) => (
                <option key={cityItem.id} value={cityItem.englishName}>
                  {cityItem.englishName}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="user-modal-submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default UserDetailModal;
