import React from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { label: "All Products", path: "/all-products" },
  { label: "Fruits", path: "/products/fruits" },
  { label: "Vegetables", path: "/products/vegetables" },
  { label: "Food Grains", path: "/products/food-grains" },
  { label: "Meat", path: "/products/meat" },
];

const SearchComp = () => {
  return (
    <div className="shopSection">
      <div className="shopTitle">Shop by Items</div>
      <ul className="shopList">
        {CATEGORIES.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchComp;