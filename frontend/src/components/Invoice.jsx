import React, { useEffect, useState } from "react";
import axios from "axios";
import { cartUrl } from "../repo/api_path";

const Invoice = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // GET directly from /api/v1/cart
      const res = await axios.get(cartUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Backend returns either { cart: { ... } } or the cart document directly
      setCart(res.data.cart || res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <h3>Loading invoice...</h3>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return <h3>No items for checkout</h3>;
  }

  // Subtotal calculation with null safety
  const subTotal = cart.items.reduce((acc, item) => {
    if (!item || !item.product) return acc;
    const price = item.product.price || 0;
    const qty = item.quantity || 1;
    return acc + price * qty;
  }, 0);

  const tax = Math.round(subTotal * 0.05); // 5% GST
  const deliveryCharge = subTotal > 500 || subTotal === 0 ? 0 : 40;
  const finalAmount = subTotal + tax + deliveryCharge;

  const handlePlaceOrder = () => {
    alert(`Order placed successfully! Total Amount: Rs ${finalAmount}`);
  };

  return (
    <div className="invoiceContainer">
      <h2>Invoice</h2>

      {cart.items.map((item) => {
        if (!item || !item.product) return null;

        const imageSrc = item.product.image
          ? item.product.image.startsWith("http")
            ? item.product.image
            : `http://localhost:3000${item.product.image}`
          : "/placeholder.png";

        const itemTotal = (item.product.price || 0) * (item.quantity || 1);

        return (
          <div className="invoiceItem" key={item._id || item.product._id}>
            <img
              src={imageSrc}
              alt={item.product.name}
              width="70"
              style={{ objectFit: "cover", borderRadius: "4px" }}
            />
            <div className="invoiceDetails">
              <h4>{item.product.name}</h4>
              <p>
                Rs {item.product.price} × {item.quantity}
              </p>
              <strong>Rs {itemTotal}</strong>
            </div>
          </div>
        );
      })}

      <hr />

      <div className="invoiceSummary">
        <p>
          Subtotal: <span>Rs {subTotal}</span>
        </p>
        <p>
          GST (5%): <span>Rs {tax}</span>
        </p>
        <p>
          Delivery: <span>Rs {deliveryCharge}</span>
        </p>
        <h3>Total Payable: Rs {finalAmount}</h3>
      </div>

      <button className="checkoutBtn" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Invoice;