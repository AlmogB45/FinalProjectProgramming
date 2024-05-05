import {BrowserRouter,Routes, Route} from "react-router-dom";
import React from 'react';
import Login from './Login'; 
import Register from './Register';
import Mainpage from './Mainpage';
import Profile from './Userprofile';

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mainpage" element={<Mainpage />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
