import {BrowserRouter,Routes, Route} from "react-router-dom";
import React from 'react';
import Login from './components/Login'; 
import Register from './components/Register';
import Mainpage from './components/Mainpage';
import Profile from './components/Userprofile';
import Subpage from './components/Subpage';
import Itempage from './components/Itempage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/subpage" element={<Subpage />} />
        <Route path="/category/:categoryId" element={<Subpage />} />
        <Route path="/item" element={<Itempage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
