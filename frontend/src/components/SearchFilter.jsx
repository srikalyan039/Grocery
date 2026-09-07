import React from "react";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Fruits", value: "fruits" },
  { label: "Vegetables", value: "vegetables" },
  { label: "Food Grains", value: "food-grains" },
  { label: "Meat", value: "meat" },
];

const SearchFilter = ({
  category,
  setCategory,
  sortBy,
  setSortBy,
  order,
  setOrder,
}) => {
  const handleReset = () => {
    setCategory("");
    setSortBy("createdAt");
    setOrder("desc");
  };

  return (
    <div className="filterBar" style={{ display: "flex", gap: "15px", alignItems: "center", margin: "15px 0" }}>
      {/* Category Filter */}
      <div className="filterGroup">
        <label htmlFor="categoryFilter">Category: </label>
        <select
          id="categoryFilter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Filter */}
      <div className="filterGroup">
        <label htmlFor="sortByFilter">Sort By: </label>
        <select
          id="sortByFilter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Date Added</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Order Filter */}
      <div className="filterGroup">
        <label htmlFor="orderFilter">Order: </label>
        <select
          id="orderFilter"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">High to Low / Newest</option>
          <option value="asc">Low to High / Oldest</option>
        </select>
      </div>

      {/* Reset Button */}
      {(category || sortBy !== "createdAt" || order !== "desc") && (
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: "4px 8px",
            cursor: "pointer",
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default SearchFilter;