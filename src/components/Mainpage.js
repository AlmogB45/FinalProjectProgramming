import React from 'react';
import '../CSS/Mainpage.css';
import logoImage from '../assets/LOGO1.png';
import Mainitems from '../components/Mainitems';
import Navbar from '../components/Navbar';

function Mainpage() {
  return (
    <div className="main-container">
      <Navbar/>
      <div className="panel">
        <div className="logoMain">
          <img src={logoImage} alt="logoMain" />
          <h1 id='MainTitle'>Please select a category</h1>
          <div className="separatorMain"></div>
        </div>
        <div className='row'>
          <Mainitems />
        </div>
      </div>
    </div>
  );
}

export default Mainpage;
    