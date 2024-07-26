import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db, storage } from '../Firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import Navbar from '../components/Navbar';
import '../CSS/Itempage.css';

function ItemPage() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchItemData() {
            try {
                // Fetch item details from Firestore
                const itemDoc = await getDoc(doc(db, 'Items', itemId));
                if (itemDoc.exists()) {
                    const itemData = itemDoc.data();
                    setItem(itemData);

                    // Fetch image URLs from Storage
                    const imageUrls = await Promise.all(
                        itemData.imageUrls.map(async (imagePath) => {
                            const imageRef = ref(storage, imagePath);
                            return await getDownloadURL(imageRef);
                        })
                    );
                    setImages(imageUrls);
                } else {
                    setError("Item not found");
                }
            } catch (err) {
                console.error("Error fetching item data:", err);
                setError("Failed to load item data");
            } finally {
                setLoading(false);
            }
        }

        fetchItemData();
    }, [itemId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!item) return <div>Item not found</div>;

    return (
        <div className="item-container">
            <Navbar/>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-12">
                        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {images.map((image, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img className="d-block w-100" src={image} alt={`Slide ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="text-container p-4 mt-4">
                            <h1 className="font-weight-bold">{item.title}</h1>
                            <p className="location-text">{item.location}</p>
                            <div className="item-desc mt-3">
                                <h2 className="font-weight-bold">Item Description</h2>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;