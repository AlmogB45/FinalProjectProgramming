import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Mainpage from './components/Mainpage';
import Profile from './components/Userprofile';
import Subpage from './components/Subpage';
import Itempage from './components/Itempage';
import PublishItem from "./components/PublishItems";
import FavoritesPage from './components/FavoritesPage';
import { FavoritesProvider } from "./Context/FavoritesContext";

function App() {
  return (
    <div className="App">
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mainpage" element={<Mainpage />} />
            <Route path="/subpage" element={<Subpage />} />
            <Route path="/category/:categoryId" element={<Subpage />} />
            <Route path="/item/:itemId" element={<Itempage />} />
            <Route path="/publish-item" element={<PublishItem />} />
            <Route path="/edit-item/:itemId" element={<PublishItem />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </div>
  );
}

export default App;
