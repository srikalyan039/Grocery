import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import SearchComp from "./components/SearchComp";
import LandingPage from "./pages/LandingPage";
import DetailComponent from "./components/DetailComponent";
import SendOtp from "./user_email/SendOtp";
import OtpVerify from "./user_email/OtpVerify";
import ShowCart from "./components/ShowCart";
import Invoice from "./components/Invoice";
import AddProduct from "./admin/AddProduct";
import AllProducts from "./products/AllProducts";
import FruitProducts from "./products/FruitProducts";
import VegetableProducts from "./products/VegetableProducts";
import FoodGrains from "./products/FoodGrains";
import MeatProducts from "./products/MeatProducts";

const App = () => {
  const location = useLocation();

  const hideSidebarRoutes = [
    "/send-otp",
    "/verify-otp",
    "/invoice",
    "/cart",
    "/add-product",
  ];

  const shouldHideSidebar =
    hideSidebarRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/single/");

  return (
    <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "0 20px" }}>
      <Navbar />

      <div style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
        {/* Category Sidebar */}
        {!shouldHideSidebar && (
          <aside style={{ width: "220px", flexShrink: 0 }}>
            <SearchComp />
          </aside>
        )}

        {/* Main Content Area */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/single/:id" element={<DetailComponent />} />
            <Route path="/send-otp" element={<SendOtp />} />
            <Route path="/verify-otp" element={<OtpVerify />} />
            <Route path="/cart" element={<ShowCart />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/add-product" element={<AddProduct />} />

            {/* All Products */}
            <Route path="/all-products" element={<AllProducts />} />

            {/* Fruits (supports both route styles) */}
            <Route path="/fruit-products" element={<FruitProducts />} />
            <Route path="/products/fruits" element={<FruitProducts />} />

            {/* Vegetables (supports both route styles) */}
            <Route path="/vegetables" element={<VegetableProducts />} />
            <Route path="/products/vegetables" element={<VegetableProducts />} />

            {/* Food Grains (supports both route styles) */}
            <Route path="/food-grains" element={<FoodGrains />} />
            <Route path="/products/food-grains" element={<FoodGrains />} />
            {/* Meat products */}
            <Route path="/meat" element={<MeatProducts />} />
            <Route path="/products/meat" element={<MeatProducts />} />
            {/* Fallback for unmatched routes */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <h2>404 - Page Not Found</h2>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;