import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../Firebase/config';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Load favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${user.uid}`)) || [];
        setFavorites(savedFavorites);
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addFavorite = (item) => {
    setFavorites((prevFavorites) => {
      const newFavorites = [...prevFavorites, item];
      localStorage.setItem(`favorites_${auth.currentUser.uid}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (itemId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter((item) => item.id !== itemId);
      localStorage.setItem(`favorites_${auth.currentUser.uid}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (itemId) => favorites.some((item) => item.id === itemId);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};