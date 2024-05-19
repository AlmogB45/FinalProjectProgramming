import React, { useState} from "react";
import Navbar from '../components/Navbar';
import profileImage from "../assets/userpic.png";
import  '../CSS/Userprofile.css';


function Profile() {
    return (
    <div className="user-container">
        <Navbar/>
            <div className="profile-panel">
                <div className="profile">
                    <img src={profileImage} alt="user" />
                    <h1>User, 23</h1>

                    <div className="separatorProfile"></div>
                    
                </div>

                    <form>
                        <div className="buttons-profile">
                            <button className="details" type="button">Personal Details</button>
                            <button className="security" type="button">Privacy and Security</button>
                            <button className="logout" type="button">Logout</button>
                        </div>
                    </form>
            </div>
        </div>
    );
}


export default Profile;