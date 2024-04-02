import React from 'react';
import './Register.css';
import logoImage from "./assets/LOGO1.png";

function Register() {
    return (
        <div className="register-container">
            <div className="panel">
                <div className="logo">
                    <img src={logoImage} alt="logo" />
                    <h1>LENDLOOP</h1>
                </div>
                <div className="register-panel">
                    <h2>New user? Sign-up below!</h2>
                    <form>
                        <div className="input-container">
                            <input type="text" placeholder="Username" />
                        </div>

                        <div className="input-container">
                            <input type="email" placeholder="Email" />
                        </div>

                        <div className="input-container">
                            <input type="password" placeholder="Password" />
                        </div>

                        <div className="InfoPrompt">
                            <h3>Personal Information</h3>
                            <hr></hr>
                            
                        </div>

                        <div className="input-container">
                            <input type="tel" placeholder="Phone Number" />
                        </div>

                        <div className="input-container">
                            <input type="number" placeholder="Age" />
                        </div>

                        <div className="button-container">
                            <button className="btn" type="button">Sign-Up</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;