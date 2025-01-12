import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase/config';
import React, { useState, useEffect } from "react";
import Login from './components/Login';
import Register from './components/Register';
import Mainpage from './components/Mainpage';
import Profile from './components/Userprofile';
import Subpage from './components/Subpage';
import Itempage from './components/Itempage';
import PublishItem from "./components/PublishItems";
import FavoritesPage from './components/FavoritesPage';
import NotFound from './components/NotFound';
import FilterPage from './components/FilterPage'
import MyUploadsPage from './components/UploadPage';
import AdminDashboard from './components/AdminDashboard';
import SearchResults from "./components/SearchResults";
import { FavoritesProvider } from "./Context/FavoritesContext";
import { ToastContainer } from 'react-toastify';


function App() {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />}/>
            <Route path="/mainpage" element={<Mainpage />} />
            <Route path="/subpage" element={<Subpage />} />
            <Route path="/category/:categoryId" element={<Subpage />} />
            <Route path="/item/:itemId" element={<Itempage />} />
            <Route path="/publish-item" element={<PublishItem />} />
            <Route path="/edit-item/:itemId" element={<PublishItem />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/filter" element={<FilterPage />} />
            <Route path="/my-uploads" element={<MyUploadsPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </div>
  );
}

export default App;
