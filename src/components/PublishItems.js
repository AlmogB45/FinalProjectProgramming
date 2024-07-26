import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../Firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function PublishItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const ref = collection(db, 'Categories');
        const snapshot = await getDocs(ref);
        const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('You must be logged in to publish an item');
      return;
    }

    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `items/${auth.currentUser.uid}/${image.name}`);
          await uploadBytes(imageRef, image);
          return getDownloadURL(imageRef);
        })
      );

      // Add item to Firestore
      const itemsCollection = collection(db, 'Items');
      await addDoc(itemsCollection, {
        title,
        description,
        categoryId: category,
        location,
        imageUrls,
        userId: auth.currentUser.uid,
        createdAt: new Date()
      });

      alert('Item published successfully!');
      navigate('/mainpage');
    } catch (error) {
      console.error('Error publishing item:', error);
      alert('Failed to publish item. Please try again.');
    }
  };

  return (
    <div className="publish-item-container">
      <Navbar />
      <div className="panel">
        <h2>Publish New Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
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
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="images">Images</label>
            <input type="file" id="images" multiple onChange={handleImageUpload} required />
          </div>
          <button type="submit" className="btn publish-btn">Publish Item</button>
        </form>
      </div>
    </div>
  );
}

export default PublishItem;