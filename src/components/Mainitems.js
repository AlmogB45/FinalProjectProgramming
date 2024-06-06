import React, {useEffect, useState} from "react";
import '../CSS/Mainitems.css';
import {db} from '../Firebase/config';
import { collection, getDocs } from 'firebase/firestore'
import { useCollection } from "../Hooks/UseCollection";

//TODO Change collection name in Firebase to "items"

export default function Mainitems() {
  const [ categories, setCategories] = useState([]);

  useEffect (() => {
    const fetchCategories = async () => {
      const ref = collection(db, 'Categories');
      const snapshot = await getDocs(ref);
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));
      const uniqueCategories = filterUniqueCategories(categoriesData);
      setCategories(uniqueCategories);
    };

    fetchCategories();
  }, []);

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
    console.log("Button clicked for category:", categoryId);

  };
    return (
      <div className="col-md-3">
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
