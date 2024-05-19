import React from "react";
import Navbar from '../components/Navbar';
import '../CSS/Itempage.css';
import image3 from "../assets/LOGO1.png";
import image2 from "../assets/item2.webp";
import image1 from "../assets/item1.webp";

function ItemPage() {
    return (
      <div className="item-container">
        <Navbar/>
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img className="d-block w-100" src={image1} alt="First slide" />
                            </div>
                            <div className="carousel-item">
                                <img className="d-block w-100" src={image2} alt="Second slide" />
                            </div>
                            <div className="carousel-item">
                                <img className="d-block w-100" src={image3} alt="Third slide" />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="col-12">
                    <div className="text-container p-4 mt-4">
                        <h1 className="font-weight-bold">A 4 chairs + Table set</h1>
                        <p className="location-text">Arie'l, Israel</p>
                        <div className="item-desc mt-3">
                            <h2 className="font-weight-bold">Item Description</h2>
                            <p>A dining set made out of 4 chairs and a table, in pristine condition!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>  
    );
}

export default ItemPage;