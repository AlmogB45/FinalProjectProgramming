import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { truncateText } from '../utils/truncateText';
import { categoryLabels } from '../utils/CategoryLabels';
import '../CSS/FilterPage.css';

const FilterPage = () => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [cities, setCities] = useState([]);
    const [categories, setCategories] = useState(Object.keys(categoryLabels));
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Fetches items from Firebase
    useEffect(() => {
        const fetchItems = async () => {
            const itemsCollection = collection(db, 'Items');
            const itemSnapshot = await getDocs(itemsCollection);
            const itemsList = itemSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(itemsList);
            setFilteredItems(itemsList);

            // Extract unique cities
            const uniqueCities = [...new Set(itemsList.map(item => item.location))];
            setCities(uniqueCities);
        };

        fetchItems();
    }, []);

    // Apllies filters and show updated results
    useEffect(() => {
        const applyFilters = () => {
            let filtered = items;

            if (selectedCity) {
                filtered = filtered.filter(item => item.location === selectedCity);
            }

            if (selectedCategory) {
                filtered = filtered.filter(item => item.categoryTitle === selectedCategory);
            }

            if (selectedTags.length > 0) {
                filtered = filtered.filter(item => 
                    selectedTags.every(tag => item.labels && item.labels.includes(tag))
                );
            }

            setFilteredItems(filtered);
        };

        applyFilters();
    }, [items, selectedCity, selectedCategory, selectedTags]);

    // Handles tag toggle
    const handleTagToggle = (tag) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // Clear tags when category changes
    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setSelectedCategory(newCategory);
        setSelectedTags([]); // Reset tags when category changes
    };

    return (
        <div className="filter-page">
            <Navbar />
            <div className="filter-container">
                <h1 id='filt-title'>Filter Items</h1>
                <p id='filt-text'>Notice: Only items that were labeled via the Edit option will appear upon selecting a category!</p>
                <div className="filter-options">
                    <select 
                        value={selectedCity} 
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">Select City</option>
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    <select 
                        value={selectedCategory} 
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                {selectedCategory && (
                    <div className="tag-options">
                        {categoryLabels[selectedCategory].map(tag => (
                            <button 
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={selectedTags.includes(tag) ? 'selected' : ''}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
                <div className="filtered-items">
                    {filteredItems.map(item => (
                        <Link to={`/item/${item.id}`} key={item.id} className="filter-card">
                            <img src={item.imageUrls[0]} alt={item.title} />
                            <div className="filter-card-body">
                            <h5 className="filter-card-title">{truncateText(item.title, 5)}</h5>
                            <p className="filter-card-text">{truncateText(item.description, 20)}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterPage;