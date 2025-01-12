import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth, storage } from '../Firebase/config';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useFavorites } from '../Context/FavoritesContext'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import EditItemModal from './EditItemModal';
import ReportModal from './ReportModal';
import '../CSS/Itempage.css';

function ItemPage() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const { addFavorite, removeFavorite, isFavorite, favorites } = useFavorites();
    const [showReportModal, setShowReportModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Check if current user is admin
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setIsAdmin(false);
                    return;
                }

                const userDocRef = doc(db, 'Users', user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && userDoc.data().isAdmin) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin status:', error);
                setIsAdmin(false);
            }
        };

        checkAdminStatus();
    }, []);

    // Fetch item from Firebase
    useEffect(() => {
        async function fetchItem() {
            try {
                const itemDoc = await getDoc(doc(db, 'Items', itemId));
                if (itemDoc.exists()) {
                    setItem({ id: itemDoc.id, ...itemDoc.data() });
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching item:", error);
            }
        }
        fetchItem();
    }, [itemId]);

    // Handles opening and closing of EditModal and item update
    const handleEdit = () => setShowEditModal(true);
    const handleCloseModal = () => setShowEditModal(false);

    const handleItemUpdate = (updatedItem) => {
        setItem(updatedItem);
        toast.success('Item updated successfully!');
    };

    // Set the format for the phone number displayed in-page
    const formatPhoneNumber = (phoneNumber) => {
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phoneNumber;
    };

    // Handles item deletion 
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

    // Handles clicking of favorite button (adding / removing from favorites accordingly)
    function handleFavoriteClick(e) {
        e.stopPropagation();
        if (item) {
            if (isFavorite(item.id)) {
                removeFavorite(item.id);
                toast.success('Removed from favorites!');

            } else {
                addFavorite(item);
                toast.success('Added to favorites!');
            }
        }
    }

    // Check if user can edit/delete (either admin or item owner)
    const canEditDelete = auth.currentUser && (isAdmin || auth.currentUser.uid === item?.userId);

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
                    <button
                        className={`favorite-btn ${isFavorite(item.id) ? 'favorited' : ''}`}
                        onClick={handleFavoriteClick}
                        aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                        ♥
                    </button>
                    <button
                        className="report-button"
                        onClick={() => setShowReportModal(true)}
                        aria-label="Report this item"
                    >
                        Report
                    </button>
                    <h1 className="item-card-title">
                        {item.title.length > 40 ? `${item.title.substring(0, 40)}...` : item.title}
                    </h1>
                    <div className="item-labels">
                        {item.labels && item.labels.map((label, index) => (
                            <span key={index} className="item-label">{label}</span>
                        ))}
                    </div>
                    <div className="info-row">
                        <span className="phone-info">
                            {item.phoneNumber ? formatPhoneNumber(item.phoneNumber) : 'No phone provided'}
                        </span>
                        <span className="location-info">
                            {item.location}
                        </span>
                    </div>
                    <div className="item-desc mt-3">
                        <h2 className="item-h2">Item Description</h2>
                        <p className="item-text">
                            {item.description.length > 400
                                ? `${item.description.substring(0, 397)}...`
                                : item.description}
                        </p>
                    </div>
                    {canEditDelete && (
                        <div className="mt-3">
                            <p className="item-tip">Tip: for better visibility, add tags via the "Edit" button</p>
                            <button onClick={handleEdit} className="edit-button">Edit</button>
                            <button onClick={handleDelete} className="delete-button">Delete</button>
                            {isAdmin && <span className="admin-badge">Admin Access</span>}
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

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                itemId={itemId}
                itemTitle={item.title}
            />
        </div>
    );
}

export default ItemPage;