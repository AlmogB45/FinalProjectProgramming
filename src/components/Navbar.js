import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../Firebase/config';
import { collection, query, where, getDocs, orderBy, startAt, endAt, doc, getDoc } from 'firebase/firestore';
import '../CSS/Navbar.css';

const Navbar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Checks and sets admin status
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
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged(checkAdminStatus);
    return () => unsubscribe();
  }, []);


    // Handle search bar 
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      return;
    }

    setIsSearching(true);
    console.log('Starting search for:', searchInput);

    try {
      // Get all items
      const itemsRef = collection(db, 'Items');
      const querySnapshot = await getDocs(itemsRef);
      
      console.log('Total documents found:', querySnapshot.size);

      // Filter items client-side
      const searchResults = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(item => {
          const searchLower = searchInput.toLowerCase();
          
          // Search in title
          const titleMatch = item.title?.toLowerCase().includes(searchLower);
          
          // Search in labels array
          const labelMatch = item.labels?.some(label => 
            label.toLowerCase().includes(searchLower)
          );
          
          // Search in description
          const descriptionMatch = item.description?.toLowerCase().includes(searchLower);
          
          // Match if any of these conditions are true
          return titleMatch || labelMatch || descriptionMatch;
        });

      console.log('Filtered results:', searchResults);

      // Store the results in sessionStorage
      sessionStorage.setItem('searchResults', JSON.stringify(searchResults));
      
      // Navigate to the search results page
      navigate(`/search?q=${encodeURIComponent(searchInput)}`);

    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-menu">
          <Link to="/mainpage" className="navbar-link">
            Home
          </Link>
          
          <Link to="/profile" className="navbar-link">
            Profile
          </Link>
          
          <Link to="/publish-item" className="navbar-link">
            Publish Item
          </Link>
          
          <Link to="/favorites" className="navbar-link">
            Favorites
          </Link>
          
          <Link to="/filter" className="navbar-link">
            Filter Items
          </Link>

          {isAdmin && (
            <Link to="/admin" className="navbar-link admin-link">
              Admin Dashboard
            </Link>
          )}
          
        </ul>

        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="text"
            placeholder="Search items..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;