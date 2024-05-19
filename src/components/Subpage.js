import React from "react";
import Navbar from '../components/Navbar';
import logoImage from '../assets/LOGO1.png';
import Subitems from "../components/Subitems";
import '../CSS/Subpage.css'

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
