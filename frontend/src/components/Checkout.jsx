import React from "react";
import { Link } from "react-router-dom";

const Checkout = () => {
  return (
    <div className="checkoutBox">
      <Link to="/invoice" className="checkoutBtn">
        Proceed to Checkout
      </Link>
    </div>
  );
};

export default Checkout;