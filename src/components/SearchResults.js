import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../CSS/SearchResult.css'; 

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');

  // Handle the loading until results are found and converted to objects
  useEffect(() => {
    setLoading(true);
    const storedResults = sessionStorage.getItem('searchResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    setLoading(false);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading">Loading search results...</div>
      </div>
    );
  }

  // Handle cases where there are no matching results
  if (!results || results.length === 0) {
    return (
      <div className="search-results-container">
        <h2>Search Results containing "{searchQuery}"</h2>
        <div className="no-results">
          <p>No items found matching your search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
                  <Navbar />
      <h2>Search Results Containing "{searchQuery}"</h2>
      <div className="separatorSearch"></div>
      <div className="results-grid">
        {results.map(item => (
          <Link to={`/item/${item.id}`} key={item.id} className="result-card">
            {item.imageUrls && item.imageUrls.length > 0 && (
              <img 
                src={item.imageUrls[0]} 
                alt={item.title} 
                className="result-image"
              />
            )}
            <div className="result-info">
              <h3>{item.title}</h3>
              {item.location && (
                <p className="result-location">{item.location}</p>
              )}
              {item.description && (
                <p className="result-description">{item.description}</p>
              )}
              {item.labels && item.labels.length > 0 && (
                <div className="result-labels">
                  {item.labels.map((label, index) => (
                    <span key={index} className="label">{label}</span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;