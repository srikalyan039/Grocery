import React, { useEffect, useState } from "react";
import axios from "axios";
import { cartUrl } from "../repo/api_path";
import { useNavigate } from "react-router-dom";

const ShowCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("token");

    if (!token) {
      alert("Please login to view your cart");
      navigate("/send-otp");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(cartUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = res.data?.cart?.items || res.data?.items || [];
      setCartItems(items);
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const deleteHandler = async (productId, unit) => {
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("token");

    try {
      await axios.delete(`${cartUrl}/${productId}?unit=${unit || "1kg"}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Could not remove item from cart");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Loading cart...</h3>
      </div>
    );
  }

  const grandTotal = cartItems.reduce((acc, item) => {
    const price = item.price ?? item.product?.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  return (
    <div className="cartContainer">
      <h2 className="cartTitle">My Cart</h2>

      {cartItems.length === 0 ? (
        <div className="cartEmpty">Your cart is empty</div>
      ) : (
        <>
          {cartItems.map((item) => {
            const product = item.product || {};
            const itemPrice = item.price ?? product.price ?? 0;
            const lineTotal = itemPrice * item.quantity;

            const imageSrc = product.image
              ? product.image.startsWith("http")
                ? product.image
                : `http://localhost:3000${product.image}`
              : "/placeholder.png";

            return (
              <div className="cartItem" key={item._id || product._id}>
                <div className="subCart">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                  <div>
                    <h4>{product.name}</h4>
                    <p style={{ fontSize: "0.9rem", color: "#666" }}>
                      Unit: {item.unit || "1kg"} | Price: Rs {itemPrice}
                    </p>
                    <p style={{ fontSize: "0.9rem" }}>
                      Qty: {item.quantity} | Total: Rs {lineTotal}
                    </p>
                  </div>
                </div>

                <button
                  className="cartDelete"
                  onClick={() => deleteHandler(product._id, item.unit)}
                >
                  Delete
                </button>
              </div>
            );
          })}

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h3>Total: Rs {grandTotal}</h3>
            <button
              className="checkoutBtn"
              onClick={() => navigate("/invoice")}
              style={{ width: "auto", padding: "10px 24px" }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowCart;