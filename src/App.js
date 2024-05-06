import {BrowserRouter,Routes, Route} from "react-router-dom";
import React from 'react';
import Login from './Login'; 
import Register from './Register';
import Mainpage from './Mainpage';
import Profile from './Userprofile';
import Subpage from "./Subpage";

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
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
