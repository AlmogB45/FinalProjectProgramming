import React, { useState, useEffect, useCallback } from 'react';
import { auth, db, storage } from '../Firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fetchCities from '../utils/cityApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/EditItemModal.css';
import TagSelector from '../utils/TagSelector';
import { categoryLabels } from '../utils/CategoryLabels';



const EditItemModal = ({ show, handleClose, itemData, itemId, onItemUpdate }) => {
    const [editedItem, setEditedItem] = useState(null);
    const [newImages, setNewImages] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [citiesList, setCitiesList] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [useRegisteredLocation, setUseRegisteredLocation] = useState(false);
    const [registeredLocation, setRegisteredLocation] = useState('');
    // If modal is shown and itemData exists, allow new parameters to be set (edit existing)
    useEffect(() => {
        if (show && itemData) {
            setEditedItem({
                ...itemData,
                description: itemData.description.substring(0, 400) // Limit to 400 characters
            });
            setNewImages([]);
            setSelectedCategory(itemData.categoryTitle || '');
            setSelectedTags(itemData.labels || []);
            setSelectedCity(itemData.location || '');
            fetchUserRegisteredLocation();
            fetchCitiesList();
        }
    }, [show, itemData]);

    // Fetch user registered location
    const fetchUserRegisteredLocation = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, 'Users', auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                setRegisteredLocation(userData.city || '');
            }
        }
    };

    // Fetch city list from API 
    const fetchCitiesList = async () => {
        try {
            const cities = await fetchCities();
            setCitiesList(cities);
        } catch (error) {
            console.error('Error fetching cities:', error);
            toast.error('Failed to load cities. Please try again.');
        }
    };

    useEffect(() => {
        if (useRegisteredLocation && registeredLocation) {
            setSelectedCity(registeredLocation);
        } else if (!useRegisteredLocation && itemData) {
            setSelectedCity(itemData.location || "");
        }
    }, [useRegisteredLocation, registeredLocation, itemData]);

    // Handles change of category and handle tag showing.
    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        setEditedItem(prev => ({ ...prev, categoryTitle: newCategory }));
        setSelectedTags([]); // Clear tags when category changes
    };

    // Handles tag toggle
    const handleTagToggle = (tag) => {
        setSelectedTags(prevTags => {
            if (prevTags.includes(tag)) {
                return prevTags.filter(t => t !== tag);
            } else if (prevTags.length < 5) {
                return [...prevTags, tag];
            }
            return prevTags;
        });
    };

    // Handles changes and set correct limitation to text length
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'title' && value.length > 40) {
            return;
        }

        if (name === 'description' && value.length > 400) {
            return;
        }

        setEditedItem(prevItem => ({ ...prevItem, [name]: value }));
    }, []);

    // Handles image upload 
    const handleImageUpload = useCallback((e) => {
        if (e.target.files) {
            setNewImages(prevImages => [...prevImages, ...Array.from(e.target.files)]);
        }
    }, []);

    // Handles image removal
    const removeImage = useCallback((index, isNewImage) => {
        if (isNewImage) {
            setNewImages(prevImages => prevImages.filter((_, i) => i !== index));
        } else {
            setEditedItem(prevItem => ({
                ...prevItem,
                imageUrls: prevItem.imageUrls.filter((_, i) => i !== index)
            }));
        }
    }, []);

    // Handles form submit 
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newImageUrls = await Promise.all(
                newImages.map(async (image) => {
                    const imageRef = ref(storage, `items/${auth.currentUser.uid}/${Date.now()}_${image.name}`);
                    await uploadBytes(imageRef, image);
                    return getDownloadURL(imageRef);
                })
            );

            const updatedItem = {
                ...editedItem,
                imageUrls: [...editedItem.imageUrls, ...newImageUrls],
                labels: selectedTags,
                categoryTitle: selectedCategory,
                location: selectedCity,
                updatedAt: new Date()
            };

            await updateDoc(doc(db, 'Items', itemId), updatedItem);
            onItemUpdate(updatedItem);
            setNewImages([]);
            handleClose();
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update item. Please try again.");
        }
    };

    if (!show) return null;

    return (
        <div className="modal show">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Edit Item</h2>
                    <button onClick={handleClose} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Title (max 40 characters)</label>
                            <input type="text" id="title" name="title" value={editedItem?.title || ''} onChange={handleChange} maxLength={40}/>
                            <small>{editedItem?.title?.length || 0}/40</small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                required
                            >
                                <option value="">Select a category</option>
                                {Object.keys(categoryLabels).map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        {selectedCategory && (
                            <div className="form-group">
                                <h3>Labels (Select up to 5)</h3>
                                <TagSelector
                                    category={selectedCategory}
                                    selectedTags={selectedTags}
                                    onTagToggle={handleTagToggle}
                                />
                                <small>{selectedTags.length}/5 labels selected</small>
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea id="edit-description" name="description" rows="3" value={editedItem?.description || ''} onChange={handleChange} maxLength={400}></textarea>
                            <small>{editedItem?.description?.length || 0}/400</small>
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
                                        setSelectedCity(itemData.location || "");
                                    }
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="images">Add Images</label>
                            <input type="file" id="images" multiple onChange={handleImageUpload} />
                        </div>
                        <div className="image-preview-container">
                            {editedItem?.imageUrls?.map((url, index) => (
                                <div key={index} className="image-preview">
                                    <img src={url} alt={`Item ${index}`} />
                                    <button type="button" onClick={() => removeImage(index, false)}>X</button>
                                </div>
                            ))}
                            {newImages.map((image, index) => (
                                <div key={`new-${index}`} className="image-preview">
                                    <img src={URL.createObjectURL(image)} alt={`New ${index}`} />
                                    <button type="button" onClick={() => removeImage(index, true)}>X</button>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="edit-submit-button">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditItemModal;