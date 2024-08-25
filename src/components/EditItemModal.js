import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../Firebase/config';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../CSS/EditItemModal.css';

const EditItemModal = ({ show, handleClose, itemData, itemId, onItemUpdate }) => {
    const [editedItem, setEditedItem] = useState(null);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        if (itemData) {
            setEditedItem({
              ...itemData,
              description: itemData.description.substring(0, 400) // Limit to 400 characters
            });
          }
        }, [itemData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'title' && value.length > 40) {
            return; 
        }

        if (name === 'description' && value.length > 400) {
            return; // Don't update if description is longer than 400 characters
          }

        setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (e) => {
        if (e.target.files) {
            setNewImages([...newImages, ...Array.from(e.target.files)]);
        }
    };

    const removeImage = (index, isNewImage) => {
        if (isNewImage) {
            setNewImages(newImages.filter((_, i) => i !== index));
        } else {
            setEditedItem({
                ...editedItem,
                imageUrls: editedItem.imageUrls.filter((_, i) => i !== index)
            });
        }
    };

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

    return (
        <div className={`modal ${show ? 'show' : ''}`}>
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
                            <label htmlFor="description">Description</label>
                            <textarea id="description" name="description" rows="3" value={editedItem?.description || ''} onChange={handleChange} maxLength={400}></textarea>
                            <small>{editedItem?.description?.length || 0}/400</small>

                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input type="text" id="location" name="location" value={editedItem?.location || ''} onChange={handleChange} />
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
                        <button type="submit" className="submit-button">Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditItemModal;