import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../Context/FavoritesContext';
import { truncateText } from '../utils/truncateText';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import '../CSS/FavoritesPage.css';

function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="favorites-container">
  <Navbar />
  <div className="fav-panel">
    <h2 className='fav-h2'>Your Favorites</h2>
    <div className='fav-row'>
      {favorites.map(item => (
        <div key={item.id} className="fav-col-md-3">
          <div className="fav-card" onClick={() => navigate(`/item/${item.id}`)}>
            <img src={item.imageUrls[0]} alt={item.title} className="card-img-top" />
            <div className="fav-card-body">
              <h5 className="fav-card-title">{truncateText(item.title, 5)}</h5>
              <p className="fav-card-text">{truncateText(item.description, 20)}</p>
              <button
                className="favorite-btn-favorited"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(item.id);
                  toast.success("Removed from favorites!");
                }}
                aria-label="Remove from favorites"
              >
                ♥
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}

export default FavoritesPage;