import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../Firebase/config';
import { collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import fetchCities from '../utils/cityApi';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/PublishItem.css';

function PublishItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [useRegisteredLocation, setUseRegisteredLocation] = useState(false);
  const [registeredLocation, setRegisteredLocation] = useState('');
  const [citiesList, setCitiesList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndUserLocation = async () => {
      try {
        // Fetch categories
        const categoriesRef = collection(db, 'Categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);

        // Fetch user's registered location
        if (auth.currentUser) {
          const userRef = doc(db, 'Users', auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRegisteredLocation(userData.city || '');
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchCategoriesAndUserLocation();
  }, []);

  useEffect(() => {
    if (useRegisteredLocation && registeredLocation) {
      setSelectedCity(registeredLocation);
    } else if (!useRegisteredLocation) {
      setSelectedCity("");
    }
  }, [useRegisteredLocation, registeredLocation]);

  useEffect(() => {
    (async function fetchCitiesFunc() {
      try {
        const cities = await fetchCities();
        setCitiesList(cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    })();
  }, []);

  // Handle change of phone number
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/[^\d\s-]/g, '');
    setPhoneNumber(cleaned);
  };

  // Handles image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prevImages => [...prevImages, ...newImages].slice(0, 5)); // Limit to 5 images
    toast.success("Succesfully added image!")

  };

  // Validates phone number 
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/; // Basic validation for 10 digits
    return phoneRegex.test(phone.replace(/[^\d]/g, '')); // Remove non-digits before testing
  };

  // Removes uploaded image
  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    toast.warning("Succesfully removed image!")
  };

  // Handle the submit 
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      toast.warning('You must be logged in to publish an item');
      return;
    }

    if (title.length > 40) {
      toast.error('Title must be 40 characters or less');
      return;
    }

    if (description.length > 400) {
      toast.error('Description must be 400 characters or less');
      return;
    }

    if (images.length === 0) {
      toast.info('Please upload at least one image');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `items/${auth.currentUser.uid}/${Date.now()}_${image.file.name}`);
          await uploadBytes(imageRef, image.file);
          return getDownloadURL(imageRef);
        })
      );

      // Add item to Firestore
      const itemsCollection = collection(db, 'Items');
      await addDoc(itemsCollection, {
        title,
        description,
        categoryId: category,
        location: selectedCity,
        imageUrls,
        userId: auth.currentUser.uid,
        phoneNumber: phoneNumber.replace(/[^\d]/g, ''),
        createdAt: new Date()
      });

      toast.success('Item published successfully!');
      navigate('/mainpage');
    } catch (error) {
      toast.error('Error publishing item:', error);
      toast.error('Failed to publish item. Please try again.');
    }
  };


  return (
    <div className="publish-item-container">
      <Navbar />
      <div className="publish-panel">
        <h2>Publish New Item</h2>
        <form className='publish-form' onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => { if (e.target.value.length <= 40) { setTitle(e.target.value); } }} required />
            <small className={`char-count ${title.length > 40 ? 'text-danger' : ''}`}>
              {title.length}/40 characters
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="publish-description" rows="3" value={description} onChange={(e) => {
              if (e.target.value.length <= 400) { setDescription(e.target.value); }
            }} required></textarea>
            <small className={`char-count ${description.length > 400 ? 'text-danger' : ''}`}>
              {description.length}/400 characters
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number (10 digits)</label>
            <input type="tel" id="publish-phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} placeholder="Enter your phone number" required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <select
              id='CitySelect'
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              disabled={useRegisteredLocation}
              required
            >
              <option value="">{useRegisteredLocation ? registeredLocation : "Select a city"}</option>
              {!useRegisteredLocation && citiesList.map((city) => (
                <option className='city-option' key={city.id} value={city.englishName}>
                  {city.englishName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="checkbox">Use my registered location</label>
            <input
              type="checkbox"
              id="publishCheck"
              checked={useRegisteredLocation}
              onChange={(e) => {
                setUseRegisteredLocation(e.target.checked);
                if (e.target.checked) {
                  setSelectedCity(registeredLocation);
                } else {
                  setSelectedCity("");
                }
              }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="images">Images (Max 5)</label>
            <input type="file" id="images" multiple accept="image/*" onChange={handleImageUpload} disabled={images.length >= 5} required />
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image.preview} alt={`Preview ${index}`} />
                  <button type="button" onClick={() => removeImage(index)}>X</button>
                </div>
              ))}
            </div>
          </div>
          <p className="item-tip">Tip: for better visibility, add tags via the "Edit" button on the item's page</p>
          <button type="submit" className="btn publish-btn">Publish Item</button>
        </form>
      </div>
    </div>
  );
}

export default PublishItem;