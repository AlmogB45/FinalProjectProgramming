import React from 'react';
import logoImage from "./assets/LOGO1.png";

function Mainpage() {
    return (
        <div className="container">
          <header className="header">
            <img src='logoImage' alt="Lendloop Logo" className="logo" />
            <h1 className="title">Please select a category</h1>
          </header>

          <div className='pet'>
            <input type = "button" placeholder='Pet Appliances' />
          </div>
          
          <button className="load-more">Click to Load More</button>
        </div>
      );
    }
    
    export default Mainpage;

    