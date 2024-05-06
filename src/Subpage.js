import React from "react";
import Navbar from './Navbar';
import logoImage from './assets/LOGO1.png';
import Subitems from "./Subitems";
import './Subpage.css'

function Subpage() {
    return (
        <div className="sub-container">
        <Navbar/>
        <div className="panel">
          <div className="logoSub">
            <img src={logoImage} alt ="logoSub" />
          </div>
          <div className="separatorSub"></div>
          <div className='row'>
           <Subitems />
           <Subitems />
           <Subitems />
           <Subitems />
           <Subitems />
           <Subitems />
           <Subitems />
           <Subitems />
           
          </div>
          

        </div>
      </div>
          
    )
  }    

  export default Subpage;
