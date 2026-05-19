// product-mfe/src/components/ProductList.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "../context/ProductContext";
import "../styles/ProductList.css";

// All sort options
const SORT_OPTIONS = [
  { value: "",           label: "Default" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "rating",     label: "Top Rated" },
];

const ProductList = ({user}) => {
  const { products, isLoading, error, loadProducts } = useProducts();

  /*
    useSearchParams() ← KEY HOOK
    searchParams = read current URL query string
    setSearchParams = write new query string to URL
    
    When you call setSearchParams, React Router:
    1. Updates the URL (adds it to browser history)
    2. Re-renders the component with new values
    → Refresh reads the URL again → state is restored automatically
  */
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current values from URL (empty string if not set)
  const category = searchParams.get("category") || "";
  const search   = searchParams.get("search")   || "";
  const sort     = searchParams.get("sort")      || "";

  /*
    Helper to update ONE param while keeping the others.
    Without this, setSearchParams({category: "men"}) would
    DELETE search and sort params from the URL.
  */
  const setParam = (key, value) => {	 	  	      	 	    	    	    	    	 	
    const next = new URLSearchParams(searchParams); // copy current params
    if (value) next.set(key, value);                // set or update
    else        next.delete(key);                   // remove if empty
    setSearchParams(next);
  };

  // Derive unique categories from loaded data for the dropdown
  const categories = [...new Set(products.map((p) => p.category))];

  // Apply filter → search → sort in sequence (all from URL)
  let displayed = [...products];

  if (category) {
    displayed = displayed.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    displayed = displayed.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  if (sort === "price_asc")  displayed.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") displayed.sort((a, b) => b.price - a.price);
  if (sort === "rating")     displayed.sort((a, b) => b.rating.rate - a.rating.rate);

  // ── Render states ──
  if (isLoading) return (
    <div className="loading">
      <div className="loader"></div>
      <p>Loading amazing fashion products...</p>
    </div>
  );

  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={loadProducts}>Retry</button>
    </div>
  );

  const hasFilters = category || search || sort;

  return (
    <div className="products-section">

      {/* ── Toolbar: Search + Filter + Sort ── */}	 	  	      	 	    	    	    	    	 	
      <div style={{
        display: "flex", gap: "12px", flexWrap: "wrap",
        marginBottom: "20px", alignItems: "center",
      }}>
        {/* Search input */}
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setParam("search", e.target.value)}
          style={{
            padding: "9px 16px", borderRadius: "8px",
            border: "2px solid #e0e0e0", fontSize: "14px",
            flex: "1", minWidth: "200px", outline: "none",
          }}
        />

        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setParam("category", e.target.value)}
          style={{
            padding: "9px 16px", borderRadius: "8px",
            border: "2px solid #e0e0e0", fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Sort dropdown */}
        <select
          value={sort}	 	  	      	 	    	    	    	    	 	
          onChange={(e) => setParam("sort", e.target.value)}
          style={{
            padding: "9px 16px", borderRadius: "8px",
            border: "2px solid #e0e0e0", fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear all button — only shows when filters are active */}
        {hasFilters && (
          <button
            onClick={() => setSearchParams({})}
            style={{
              padding: "9px 18px", borderRadius: "8px",
              background: "#ff6b6b", color: "white",
              border: "none", cursor: "pointer",
              fontWeight: "700", fontSize: "14px",
            }}
          >
            ✕ Clear All
          </button>
        )}
      </div>

      {/* ── Active filter pills ── */}
      {hasFilters && (
        <div style={{
          display: "flex", gap: "8px",
          flexWrap: "wrap", marginBottom: "16px",
        }}>
          {category && (
            <FilterPill
              label={`Category: ${category}`}	 	  	      	 	    	    	    	    	 	
              onRemove={() => setParam("category", "")}
            />
          )}
          {search && (
            <FilterPill
              label={`Search: "${search}"`}
              onRemove={() => setParam("search", "")}
            />
          )}
          {sort && (
            <FilterPill
              label={`Sort: ${SORT_OPTIONS.find((o) => o.value === sort)?.label}`}
              onRemove={() => setParam("sort", "")}
            />
          )}
        </div>
      )}

      {/* ── Results count ── */}
      <p style={{ color: "#666", marginBottom: "16px", fontSize: "14px" }}>
        Showing <strong>{displayed.length}</strong> of{" "}
        <strong>{products.length}</strong> products
      </p>

      {/* ── Product grid or empty state ── */}
      {displayed.length > 0 ? (
        <div className="products-grid">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} 
            user={user} />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h3>No products match your filters</h3>
          <button onClick={() => setSearchParams({})}>
            Clear all filters
          </button>
        </div>
      )}	 	  	      	 	    	    	    	    	 	
    </div>
  );
};

// Reusable pill component for active filters
const FilterPill = ({ label, onRemove }) => (
  <span style={{
    background: "#ede9ff", color: "#5a4fcf",
    padding: "5px 14px", borderRadius: "20px",
    fontSize: "13px", fontWeight: "600",
    display: "inline-flex", alignItems: "center", gap: "8px",
  }}>
    {label}
    <span
      onClick={onRemove}
      style={{ cursor: "pointer", fontWeight: "800", fontSize: "15px" }}
    >
      ×
    </span>
  </span>
);

export default ProductList;