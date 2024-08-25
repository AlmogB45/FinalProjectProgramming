import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import '../CSS/Mainitems.css';
import {db, auth} from '../Firebase/config';
import { collection, getDocs } from 'firebase/firestore'
import { useCollection } from "../Hooks/UseCollection";

export default function Mainitems() {
  const [ categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchCategories();
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const ref = collection(db, 'Categories');
      const snapshot = await getDocs(ref);
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const uniqueCategories = filterUniqueCategories(categoriesData);
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again later.");
    }
  };

  const filterUniqueCategories = (categoriesData) => {
    const uniqueCategories = [];
    const categoryTitles = new Set();
    categoriesData.forEach(category => {
      if (!categoryTitles.has(category.title)) {
        uniqueCategories.push(category);
        categoryTitles.add(category.title);
      }
    });
    return uniqueCategories;
  };

  const handleButtonClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
    console.log("Button clicked for category:", categoryId);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

    return (
      <div className="main-col-md-3">
    {categories.map(category => (
        <div key={category.id}>
            <button
                className="item-buttonMain"
                type="button"
                onClick={() => handleButtonClick(category.id)}
            >
                <img src={category.img_url} alt={category.title} />
                <span>{category.title}</span>
            </button>
        </div>
        ))}
    </div>
    );
}
