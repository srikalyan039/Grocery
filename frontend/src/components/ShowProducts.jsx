import React, { useEffect, useState } from "react";
import axios from "axios";
import { productUrl, cartUrl } from "../repo/api_path";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useSearchStore from "../store/useSearchStore";
import SearchFilter from "./SearchFilter";

const ShowProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
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

  // 1. Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(productUrl);
      const list = res.data?.products || (Array.isArray(res.data) ? res.data : []);
      setAllProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Client-side search, filtering, and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by search keyword
    if (search && search.trim() !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase().trim())
      );
    }

    // Filter by category
    if (category && category !== "All" && category !== "") {
      filtered = filtered.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      let valA = a[sortBy] ?? "";
      let valB = b[sortBy] ?? "";

      if (sortBy === "price") {
        return order === "asc" ? valA - valB : valB - valA;
      }

      if (typeof valA === "string") {
        return order === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return order === "asc" ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    setShowProducts(filtered);
  }, [allProducts, search, category, sortBy, order]);

  // Handle unit price change
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
  const cartHandler = async (productId, quantity = 1) => {
    const userToken =
      localStorage.getItem("userToken") || localStorage.getItem("token");

    if (!userToken) {
      alert("Please login first");
      return;
    }

    try {
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

export default ShowProducts;