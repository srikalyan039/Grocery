import React, { useEffect, useState } from "react";
import axios from "axios";
import { productUrl, cartUrl } from "../repo/api_path";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const FoodGrains = () => {
  const [grains, setGrains] = useState([]);
  const [unitPrice, setUnitPrice] = useState({});
  const [quantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { incrementCart } = useAuthStore();

  // Fetch and filter food grains
  const fetchGrains = async () => {
    try {
      setLoading(true);
      const res = await axios.get(productUrl);
      const allItems =
        res.data?.products ||
        (Array.isArray(res.data) ? res.data : []);

      // Filter food grains client-side
      const grainItems = allItems.filter(
        (item) => item.category?.toLowerCase() === "food-grains"
      );

      setGrains(grainItems);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrains();
  }, []);

  // Handle unit change
  const handleUnitChange = (productId, unit, basePrice) => {
    let price = basePrice;
    if (unit === "500g") price = basePrice / 2;
    if (unit === "2kg" || unit === "2kgs") price = basePrice * 2;
    if (unit === "5kg" || unit === "5kgs") price = basePrice * 5;

    setUnitPrice((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  // Add to cart
  const cartHandler = async (productId, qty = 1) => {
    const userToken =
      localStorage.getItem("userToken") || localStorage.getItem("token");

    if (!userToken) {
      alert("Please login to buy products");
      return;
    }

    try {
      // POST directly to /api/v1/cart
      const res = await axios.post(
        cartUrl,
        {
          productId,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      alert(res.data?.msg || res.data?.message || "Product added to cart");
      if (incrementCart) {
        incrementCart(qty);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Failed to add product"
      );
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Loading food grains...</h3>
      </div>
    );
  }

  return (
    <div className="containerSection">
      <div className="itemTitle">
        Category: <span>Food Grains</span>
      </div>

      <div className="productSection">
        {grains.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", width: "100%" }}>
            <h3>No food grains found</h3>
          </div>
        ) : (
          grains.map((product) => {
            const imageSrc = product.image
              ? product.image.startsWith("http")
                ? product.image
                : `http://localhost:3000${product.image}`
              : "/placeholder.png";

            return (
              <section className="proSection" key={product._id}>
                <Link to={`/single/${product._id}`}>
                  <div className="proImage">
                    <img src={imageSrc} alt={product.name} />
                    <h3 className="proName">{product.name}</h3>
                  </div>
                </Link>

                <div className="proSub">
                  <select
                    className="proSelect"
                    defaultValue="1kg"
                    onChange={(e) =>
                      handleUnitChange(
                        product._id,
                        e.target.value,
                        product.price
                      )
                    }
                  >
                    <option value="500g">500g</option>
                    <option value="1kg">1kg</option>
                    <option value="2kg">2kg</option>
                    <option value="5kg">5kg</option>
                  </select>

                  <h3 className="proPrice">
                    Rs {unitPrice[product._id] ?? product.price}
                  </h3>
                </div>

                <button
                  className="proButton"
                  onClick={() => cartHandler(product._id, quantity)}
                >
                  Add to Cart
                </button>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
};

export default FoodGrains;