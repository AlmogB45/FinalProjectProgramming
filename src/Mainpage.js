import React from 'react';
import './Mainpage.css';
import logoImage from "./assets/LOGO1.png";

function Mainpage() {
    return (
      <div className="main-container">
        <div className="panel">
          <div className="logoMain">
            <img src={logoImage} alt ="logoMain" />
            <h1 id='MainTitle'>Please select a category</h1>
            <div className="separatorMain"></div>
          </div>
          
          <form>
            <div className="input-containerMain">
              <button className="pets" type="button">Pets</button>
              <button className="appliance" type="button">House Appliances</button>
              <button className="outdoor" type="button">Outdoor</button>
              <button className="clothes" type="button">Clothes</button>
              <button className="furniture" type="button"> Furniture</button>
              <button className="games" type="button">Games</button>
            </div>
          </form>

        </div>
      </div>
          
    )
  }    
    
    export default Mainpage;

    