import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productUrl, cartUrl } from "../repo/api_path";
import useAuthStore from "../store/useAuthStore";

const DetailComponent = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoggedIn, incrementCart } = useAuthStore();

  // Fetch single product details
  const singleHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${productUrl}/${id}`);
      // Backend returns { product: { ... } }
      setProduct(res.data.product || res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      singleHandler();
    }
  }, [id]);

  // Add product to cart
  const addToCartHandler = async () => {
    try {
      if (!isLoggedIn) {
        alert("Please login first");
        return;
      }

      const token =
        localStorage.getItem("userToken") || localStorage.getItem("token");

      if (!token) {
        alert("User session expired. Please login again.");
        return;
      }

      // POST to /api/v1/cart directly
      const res = await axios.post(
        cartUrl,
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || res.data.msg || "Added to cart successfully");
      if (incrementCart) {
        incrementCart(1);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.msg || "Something went wrong adding to cart");
    }
  };

  // Save for later (localStorage wishlist)
  const saveForLaterHandler = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
      const alreadySaved = saved.some((item) => item._id === product._id);

      if (!alreadySaved) {
        saved.push(product);
        localStorage.setItem("wishlist", JSON.stringify(saved));
        alert("Saved for later");
      } else {
        alert("Item is already in your saved list");
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found</h2>;

  const imageSrc = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `http://localhost:3000${product.image}`
    : "/placeholder.png";

  return (
    <div className="detailSection">
      <div className="imgCont">
        <img
          className="singleImage"
          src={imageSrc}
          alt={product.name}
          style={{ width: "300px", height: "300px", objectFit: "cover" }}
        />
      </div>

      <div className="singleDetail">
        <div className="singleName">{product.name}</div>
        <div className="singlePrice">
          Price: ₹{product.price} / {product.unit}
        </div>
        <div className="singleDesc">Description: {product.desc}</div>

        <div className="singleBtn">
          <button className="singleCartBtn" onClick={addToCartHandler}>
            Add To Cart
          </button>
          <button className="singleLaterBtn" onClick={saveForLaterHandler}>
            Save for later
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailComponent;