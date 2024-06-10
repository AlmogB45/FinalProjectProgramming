import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../Firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import logoImage from '../assets/LOGO1.png';
import Subitems from "../components/Subitems";
import '../CSS/Subpage.css'

function Subpage() {
  const { categoryId } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const ref = collection(db, 'Items');
      const q = query(ref, where('categoryId', '==', categoryId));
      const snapshot = await getDocs(q);
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
    };

    fetchItems();
  }, [categoryId]);

  return (
    <div className="sub-container">
      <Navbar />
      <div className="panel">
        <div className="logoSub">
          <img src={logoImage} alt="logoSub" />
        </div>
        <div className="separatorSub"></div>
        <div className='row'>
          {items.map(item => (
            <Subitems key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>

  )
}

export default Subpage;
