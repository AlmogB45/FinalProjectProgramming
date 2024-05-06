import React from "react";
import './Subitems.css';
import logoImage from "./assets/LOGO1.png";

function Subitems() {
  return (
<div className="col-md-3">    
    <div className="card shadow-on-hover">
      <img src={logoImage} alt="Card image" className="card-img-top" />
      <div className="card-body">
        <h3>A more descriptive title</h3> {/* Replace with actual title */}
        <p>This is a more detailed description of the item.</p> {/* Replace with actual description */}
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
