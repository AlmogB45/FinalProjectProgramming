import React, { useState, useEffect } from 'react';
import '../CSS/Register.css';
import CityAPI from './CityAPI';
import logoImage from "../assets/LOGO1.png";

function Register() {
    // Add function to fetchCityAPI 
    //TODO: Check CityAPI

    
    return (
        <div className="register-container">
            <div className="panel">
                <div className="logoReg">
                    <img src={logoImage} alt="logoReg" />
                    <h1 id='RegTitle'>LENDLOOP</h1>
                </div>
                <div className="register-panel">
                    <h2>New user? Sign-up below!</h2>
                    <form>
                        <div className="input-containerReg">
                            <input type="text" placeholder="Username" />
                        </div>

                        <div className="input-containerReg">
                            <input type="email" placeholder="Email" />
                        </div>

                        <div className="input-containerReg">
                            <input type="password" placeholder="Password" />
                        </div>

                        <div className="InfoPromptReg">
                            <h3>Personal Information</h3>                          
                        </div>

                        <div className="separatorRegister"></div>

                        <div className="input-containerReg">
                            <input type="tel" placeholder="Phone Number" />
                        </div>

                        <div className="input-containerReg">
                            <input type="Date" placeholder="Age" />
                        </div>
                        
                        {/* Fix the input below!! */}
                        <div className="input-containerReg">
                        <select>
                            <option value="">Select City</option>                             
                        </select>
                        </div>
                    </form>
                </div>

                <div className="button-containerReg">
                    <button className="SignUp" type="button">Sign-Up</button>
                </div>

            </div>
        </div>
    );
}

export default Register;