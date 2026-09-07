import axios from "axios";
import React, { useEffect, useState } from "react";
import { cartUrl, productUrl } from "../repo/api_path";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";

const AllProducts = () => {
  const [basket, setBasket] = useState([]);
  const [unitPrice, setUnitPrice] = useState({});
  const [selectedUnit, setSelectedUnit] = useState({});
  const [loading, setLoading] = useState(true);

  const { incrementCart } = useAuthStore();
  const { search } = useSearchStore();

  // Fetch all products
  const productHandler = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${productUrl}/all-products`);
      console.log("API Response:", res.data);

      const items =
        res.data?.products ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      setBasket(items);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productHandler();
  }, []);

  // Handle unit change: update both calculated price and chosen unit
  const handleUnitChange = (productId, unit, basePrice) => {
    let price = basePrice;
    if (unit === "500g") price = basePrice / 2;
    if (unit === "2kg" || unit === "2kgs") price = basePrice * 2;
    if (unit === "5kg" || unit === "5kgs") price = basePrice * 5;

    setSelectedUnit((prev) => ({
      ...prev,
      [productId]: unit,
    }));

    setUnitPrice((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  // Add to cart sending product ID, quantity, selected unit, and price
  const carthandler = async (product) => {
    const userToken =
      localStorage.getItem("userToken") || localStorage.getItem("token");

    if (!userToken) {
      alert("Please login to buy products");
      return;
    }

    const chosenUnit = selectedUnit[product._id] || "1kg";
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
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      alert(res.data?.msg || res.data?.message || "Product added to cart");
      if (incrementCart) {
        incrementCart(1);
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

  // Filter products by global search keyword
  const filteredProducts = basket.filter((product) =>
    product?.name
      ?.toLowerCase()
      .includes((search || "").toLowerCase().trim())
  );

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h3>Loading products...</h3>
      </div>
    );
  }

  return (
    <div className="productSection">
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", width: "100%" }}>
          <h3>No products found</h3>
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

export default AllProducts;