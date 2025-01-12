import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { truncateText } from '../utils/truncateText';
import { toast } from 'react-toastify';
import '../CSS/UploadPage.css';

const UploadsPage = () => {
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Checks if user is logged-in, if not, navigate to login page
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchMyItems(user.uid);
            } else {
                setLoading(false);
                toast.info("Please log in to view your uploads");
                navigate("/");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Fetch items from Firebase
    const fetchMyItems = async (uid) => {
        try {
            const q = query(
                collection(db, 'Items'),
                where('userId', '==', uid)
            );
            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMyItems(items);
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to fetch your items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="uploads-container">
            <Navbar />
            <div className="upload-panel">
                <h2 className='upload-h2'>Your Uploads</h2>
                <div className='upload-row'>
                    {myItems.map(item => (
                        <div key={item.id} className="upload-col-md-3">
                            <div className="upload-card" onClick={() => navigate(`/item/${item.id}`)}>
                                <img src={item.imageUrls[0]} alt={item.title} className="card-img-top" />
                                <div className="upload-card-body">
                                    <h5 className="upload-card-title">{truncateText(item.title, 5)}</h5>
                                    <p className="upload-card-text">{truncateText(item.description, 20)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadsPage;