import React, { useEffect, useState } from "react";
import axios from "axios";
import { productUrl, cartUrl } from "../repo/api_path";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";

const MeatProducts = () => {
  const [basket, setBasket] = useState([]);
  const [unitPrice, setUnitPrice] = useState({});
  const [selectedUnits, setSelectedUnits] = useState({});
  const [loading, setLoading] = useState(true);

  const { incrementCart } = useAuthStore();
  const { search } = useSearchStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${productUrl}/all-products`);
        const items = res.data?.products || res.data?.data || [];
        // Filter by meat category
        const meats = items.filter(
          (p) => p.category?.toLowerCase() === "meat"
        );
        setBasket(meats);
      } catch (err) {
        console.error("Error fetching meat products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleUnitChange = (productId, unit, basePrice) => {
    let price = basePrice;
    if (unit === "500g") price = basePrice / 2;
    if (unit === "2kg" || unit === "2kgs") price = basePrice * 2;
    if (unit === "5kg" || unit === "5kgs") price = basePrice * 5;

    setSelectedUnits((prev) => ({ ...prev, [productId]: unit }));
    setUnitPrice((prev) => ({ ...prev, [productId]: price }));
  };

  const carthandler = async (product) => {
    const token =
      localStorage.getItem("userToken") || localStorage.getItem("token");
    if (!token) {
      alert("Please login to buy products");
      return;
    }

    const chosenUnit = selectedUnits[product._id] || "1kg";
    const chosenPrice = unitPrice[product._id] ?? product.price;

    try {
      const res = await axios.post(
        cartUrl,
        {
          productId: product._id,
          quantity: 1,
          unit: chosenUnit,
          price: chosenPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data?.msg || res.data?.message || "Added to cart");
      if (incrementCart) incrementCart(1);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add to cart");
    }
  };

  const filteredProducts = basket.filter((p) =>
    p?.name?.toLowerCase().includes((search || "").toLowerCase().trim())
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Loading meat products...</h3>
      </div>
    );
  }

  return (
    <div className="productSection">
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", width: "100%" }}>
          <h3>No meat products found</h3>
        </div>
      ) : (
        filteredProducts.map((product) => {
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
                    handleUnitChange(product._id, e.target.value, product.price)
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
                onClick={() => carthandler(product)}
              >
                Add to Cart
              </button>
            </section>
          );
        })
      )}
    </div>
  );
};

export default MeatProducts;