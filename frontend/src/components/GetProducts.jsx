import React, { useEffect, useState } from "react";
import axios from "axios";
import { productUrl, cartUrl } from "../repo/api_path";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";
import SearchFilter from "./SearchFilter";

const GetProducts = () => {
  const [showProducts, setShowProducts] = useState([]);
  const [unitPrice, setUnitPrice] = useState({});
  const [loading, setLoading] = useState(true);

  // Global search from store
  const { search } = useSearchStore();

  // Local filters
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const { incrementCart } = useAuthStore();

  // Fetch products (handles both general listing and filtered search)
  const searchHandler = async () => {
    try {
      setLoading(true);

      let res;
      // If there is an active search or category query, hit the search endpoint if available
      if (search || category) {
        try {
          res = await axios.get(`${productUrl}/search`, {
            params: {
              search,
              category,
              sortBy,
              order,
              page: 1,
              limit: 20,
            },
          });
        } catch {
          // Fallback to all products if search endpoint is not configured
          res = await axios.get(productUrl);
        }
      } else {
        res = await axios.get(productUrl);
      }

      // Supports { products: [...] }, { data: [...] }, or a direct array
      const productList =
        res.data?.products ||
        res.data?.data ||
        (Array.isArray(res.data) ? res.data : []);

      setShowProducts(productList);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // React to search & filter adjustments
  useEffect(() => {
    searchHandler();
  }, [search, category, sortBy, order]);

  // Unit pricing adjustments
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

  // Add to cart handler
  const cartHandler = async (productId, quantity = 1) => {
    const userToken =
      localStorage.getItem("userToken") || localStorage.getItem("token");

    if (!userToken) {
      alert("Please login first");
      return;
    }

    try {
      // POST directly to /api/v1/cart
      const res = await axios.post(
        cartUrl,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      alert(res.data?.msg || res.data?.message || "Product added to cart");
      if (incrementCart) {
        incrementCart(quantity);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.msg || "Failed to add product");
    }
  };

  return (
    <>
      {/* Category / Sort Filters */}
      <SearchFilter
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Loading products...</h2>
        </div>
      ) : showProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>No products found</h2>
        </div>
      ) : (
        <div className="productSection">
          {showProducts.map((product) => {
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
                  onClick={() => cartHandler(product._id, 1)}
                >
                  Add to Cart
                </button>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
};

export default GetProducts;