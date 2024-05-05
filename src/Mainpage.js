import React from 'react';
import './Mainpage.css';
import logoImage from './assets/LOGO1.png';
import Mainitems from './Mainitems';
import Navbar from './Navbar';

function Mainpage() {
    return (
      <div className="main-container">
        <div className="panel">
          <div className="logoMain">
            <img src={logoImage} alt ="logoMain" />
            <h1 id='MainTitle'>Please select a category</h1>
            <div className="separatorMain"></div>
          </div>
          <div className='row'>
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
            <Mainitems />
          </div>
          

        </div>
      </div>
          
    )
  }    
    
    export default Mainpage;

    