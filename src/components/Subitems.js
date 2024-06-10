import React from "react";
import '../CSS/Subitems.css';
import logoImage from "../assets/LOGO1.png";

function Subitems({ item }) {
  return (
<div className="col-md-3">    
    <div className="card shadow-on-hover">
      <img src={logoImage} alt="Card image" className="card-img-top" />
      <div className="card-body">
        <h3>{item.title}</h3> 
        <p>{item.description}</p> 
        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-primary">View Details</button>
          <button type="button" className="btn btn-outline-secondary">Add to Cart</button>
        </div>
      </div>
    </div>
</div>
  );
}

export default Subitems;
