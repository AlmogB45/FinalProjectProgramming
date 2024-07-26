import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../Firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import logoImage from '../assets/LOGO1.png';
import Subitems from "../components/Subitems";
import '../CSS/Subpage.css'

function Subpage() {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        console.error("Error fetching items:", error);
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

  const truncateText = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return text;
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
  <div className="panel">
    <h2>Items in this category</h2>
    <div className='row-sub'>
      {items.map(item => (
        <div key={item.id} className="col-md-3">
          <div className="card" onClick={() => handleItemClick(item.id)}>
            <img src={item.imageUrls[0]} alt={item.title} />
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{truncateText(item.description, 30)}</p>
              <button 
                className="favorite-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Add to favorites');
                }}
                aria-label="Add to favorites"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
}

//     <div className="sub-container">
//       <Navbar />
//       <div className="panel">
//         <div className="logoSub">
//           <img src={logoImage} alt="logoSub" />
//         </div>
//         <div className="separatorSub"></div>
//         <div className='row'>
//           {items.map(item => (
//             <Subitems key={item.id} item={item} />
//           ))}
//         </div>
//       </div>
//     </div>

//   )
// }

export default Subpage;
