import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth, storage } from '../Firebase/config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import Navbar from '../components/Navbar';
import EditItemModal from './EditItemModal';
import '../CSS/Itempage.css';

function ItemPage() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            const itemDoc = await getDoc(doc(db, 'Items', itemId));
            if (itemDoc.exists()) {
                setItem(itemDoc.data());
            }
        };
        fetchItem();
    }, [itemId]);

    const handleEdit = () => setShowEditModal(true);
    const handleCloseModal = () => setShowEditModal(false);

    const handleItemUpdate = (updatedItem) => {
        setItem(updatedItem);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                // Delete images from storage
                await Promise.all(item.imageUrls.map(async (url) => {
                    const imageRef = ref(storage, url);
                    try {
                        await deleteObject(imageRef);
                    } catch (error) {
                        console.error("Error deleting image:", error);
                    }
                }));

                // Delete item document
                await deleteDoc(doc(db, 'Items', itemId));
                navigate('/mainpage');
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Failed to delete item. Please try again.");
            }
        }
    };

    if (!item) return <div>Loading...</div>;

    return (
        <div className="item-container">
            <Navbar />
            <div className="container mt-5">
                <div className="item-card">
                    <div id="itemCarousel" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {item.imageUrls.map((url, index) => (
                                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                    <img className="d-block w-100" src={url} alt={`Slide ${index}`} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#itemCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#itemCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className="item-card-body">
                        <h1 className="item-card-title">{item.title.length > 40 ? `${item.title.substring(0, 40)}...` : item.title}</h1>
                        <p className="item-card-text location-text">{item.location}</p>
                        <div className="item-desc mt-3">
                            <h2 className="item-h2">Item Description</h2>
                            <p className="item-text">{item.description.length > 400
                                ? `${item.description.substring(0, 397)}...`
                                : item.description}</p>
                        </div>
                        {auth.currentUser && auth.currentUser.uid === item.userId && (
                            <div className="mt-3">
                                <button onClick={handleEdit} className="edit-button">Edit</button>
                                <button onClick={handleDelete} className="delete-button">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EditItemModal
                show={showEditModal}
                handleClose={handleCloseModal}
                itemData={item}
                itemId={itemId}
                onItemUpdate={handleItemUpdate}
            />
        </div>
    );
}

export default ItemPage;