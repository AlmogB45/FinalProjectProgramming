import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../Firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import { truncateText } from '../utils/truncateText';
import { useFavorites } from '../Context/FavoritesContext'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../CSS/Subpage.css'

function Subpage() {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleFavoriteClick = (e, item) => {
    e.stopPropagation();
    if (isFavorite(item.id)) {
      removeFavorite(item.id);
      toast.success('Removed from favorites!');
    } else {
      addFavorite(item);
      toast.success('Added to favorites!');
    }
  };


  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const itemsCollection = collection(db, 'Items');
        const q = query(itemsCollection, where('categoryId', '==', categoryId));
        const itemsSnapshot = await getDocs(q);
        const itemsList = itemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(itemsList);
      } catch (error) {
        toast.error("Error fetching items:", error);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchItems();
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [categoryId, navigate]);

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  

  return (
    <div className="sub-container">
  <Navbar />
  <div className="sub-panel">
    <h2 id="sub-title">Items in this category</h2>
    <div className='separatorSub'></div>
    <div className='sub-row'>
      {items.map(item => (
          <div key={item.id} className="sub-card" onClick={() => handleItemClick(item.id)}>
            <img src={item.imageUrls[0]} alt={item.title} />
            <div className="sub-card-body">
              <h5 className="sub-card-title">{item.title}</h5>
              <p className="sub-card-text">{truncateText(item.description, 30)}</p>
              <button 
               className={`favorite-btn ${isFavorite(item.id) ? 'favorited' : ''}`}
               onClick={(e) => {
                 e.stopPropagation();
                 handleFavoriteClick(e, item);
               }}
               aria-label={isFavorite(item.id) ? "Remove from favorites" : "Add to favorites"}
             >
               ♥
             </button>
            </div>
          </div>
        // </div>
      ))}
    </div>
  </div>
</div>
  );
}

export default Subpage;
