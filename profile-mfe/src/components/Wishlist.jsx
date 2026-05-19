// profile-mfe/src/components/Wishlist.jsx
import React from "react";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../store/fashionApi";

const Wishlist = ({ user }) => {
  const userId = user?.userId || "";

  // RTK Query — fetch wishlist with caching
  const {
    data:      wishlist = [],
    isLoading,
    isFetching,
    isError,
  } = useGetWishlistQuery(userId, { skip: !userId });

  // Mutation hook for removal
  const [removeFromWishlist, { isLoading: isRemoving }] =
    useRemoveFromWishlistMutation();

  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(itemId).unwrap();
      // Cache auto-invalidated → wishlist refetches
    } catch (err) {
      console.error("[Wishlist] Remove failed:", err);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────
  if (isLoading) return (
    <div style={{ textAlign: "center", padding: "60px", color: "#666" }}>
      <div style={{
        width: "40px", height: "40px", borderRadius: "50%",
        border: "4px solid #f0f0f0", borderTopColor: "#7B7FD8",
        margin: "0 auto 16px",
      }} />
      <p>Loading your wishlist...</p>
    </div>
  );

  // ── Error state ────────────────────────────────────────────────────────
  if (isError) return (
    <div style={{	 	  	      	 	    	    	    	    	 	
      background: "#fff5f5", borderRadius: "12px",
      padding: "24px", textAlign: "center", color: "#c53030",
    }}>
      <h3>⚠️ Failed to load wishlist</h3>
      <p>Please try again later.</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px",
      }}>
        <h2 style={{ margin: 0, color: "#1a1a2e" }}>
          ❤️ My Wishlist
          <span style={{
            marginLeft: "10px", fontSize: "14px",
            background: "#7B7FD8", color: "white",
            padding: "2px 10px", borderRadius: "20px",
          }}>
            {wishlist.length}
          </span>
        </h2>

        {/* isFetching — background sync indicator */}
        {isFetching && !isLoading && (
          <span style={{ fontSize: "12px", color: "#7B7FD8" }}>
            ↻ Syncing...
          </span>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div style={{
          background: "#fff", borderRadius: "12px",
          padding: "40px", textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          <p style={{ fontSize: "18px" }}>💔 No items saved yet.</p>
          <p style={{ color: "#666" }}>
            Click ❤️ on any product to save it here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {wishlist.map((item) => (
            <div key={item.id} style={{	 	  	      	 	    	    	    	    	 	
              background: "#fff", borderRadius: "12px",
              padding: "16px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex", alignItems: "center", gap: "16px",
            }}>
              <img
                src={item.image} alt={item.title}
                style={{
                  width: "70px", height: "90px",
                  objectFit: "cover", borderRadius: "8px",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: "700", fontSize: "15px",
                  color: "#1a1a2e", marginBottom: "4px",
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontSize: "12px", color: "#7B7FD8",
                  textTransform: "uppercase", fontWeight: "700",
                  marginBottom: "6px",
                }}>
                  {item.category}
                </div>
                <div style={{
                  fontSize: "18px", fontWeight: "800", color: "#1a1a2e",
                }}>
                  ${Number(item.price).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                disabled={isRemoving}	 	  	      	 	    	    	    	    	 	
                style={{
                  background: "#fff5f5", border: "2px solid #fed7d7",
                  color: "#c53030", padding: "8px 16px",
                  borderRadius: "8px", cursor: "pointer",
                  fontWeight: "700", fontSize: "13px",
                }}
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;