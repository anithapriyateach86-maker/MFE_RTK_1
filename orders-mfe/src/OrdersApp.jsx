// orders-mfe/src/OrdersApp.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import eventBus, { EVENTS } from "./utils/eventBus";

const API_URL = "http://localhost:4000/orders";

// ── API helpers ───────────────────────────────────────────────────────────────

// Fetch orders for a specific user from API
async function fetchOrdersFromAPI(userId) {
  try {
    const res = await fetch(`${API_URL}?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  } catch (err) {
    console.error("[OrdersApp] fetchOrders error:", err);
    return [];
  }
}

// Save a new order to API
async function saveOrderToAPI(orderData) {
  try {
    const res = await fetch(API_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error("Failed to save order");
    return await res.json();
  } catch (err) {
    console.error("[OrdersApp] saveOrder error:", err);
    return null;
  }
}

// ── Status badge ──────────────────────────────────────────────────────────────
const statusStyle = (s) => ({	 	  	      	 	    	    	    	    	 	
  fontSize: "12px", fontWeight: "700",
  padding: "4px 12px", borderRadius: "20px",
  background: s === "Delivered" ? "#d4edda" :
              s === "Shipped"   ? "#cce5ff" : "#fff3cd",
  color:      s === "Delivered" ? "#155724" :
              s === "Shipped"   ? "#004085" : "#856404",
});

// ── Orders List ───────────────────────────────────────────────────────────────
function OrdersList({ user }) {
  const userId            = user?.userId || "guest";
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API on mount and when userId changes
  useEffect(() => {
    setLoading(true);
    fetchOrdersFromAPI(userId).then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [userId]);

  // Listen to ORDER_PLACED — validate userId then save to API
  useEffect(() => {
    const handler = eventBus.subscribe(EVENTS.ORDER_PLACED, async (data) => {
      // Validate userId
      if (data.userId !== userId) {
        console.warn("[OrdersApp] Rejected ORDER_PLACED — userId mismatch");
        return;
      }

      const newOrder = {
        id:     `ORD-${String(Date.now()).slice(-6)}`,
        date:   new Date().toISOString().split("T")[0],
        items:  data.items  || [],
        total:  data.total  || 0,
        status: "Processing",
        userId,                  // ← scope to user
      };

      // Save to API (json-server)
      const saved = await saveOrderToAPI(newOrder);

      if (saved) {	 	  	      	 	    	    	    	    	 	
        // Refresh orders list from API
        const updated = await fetchOrdersFromAPI(userId);
        setOrders(updated);
        console.log("[OrdersApp] Order saved to API ✅", saved.id);
      }
    });

    return () => eventBus.unsubscribe(EVENTS.ORDER_PLACED, handler);
  }, [userId]);

  if (loading) return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>📦 My Orders</h2>
      <p style={{ color: "#666" }}>Loading orders...</p>
    </div>
  );

  if (orders.length === 0) {
    return (
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "24px" }}>📦 My Orders</h2>
        <div style={{
          background: "#fff", borderRadius: "12px",
          padding: "40px", textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}>
          <p style={{ fontSize: "18px", color: "#666" }}>No orders yet.</p>
          <Link to="/products" style={{
            color: "#7B7FD8", fontWeight: "600",
            textDecoration: "none",
          }}>
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }	 	  	      	 	    	    	    	    	 	

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "24px" }}>📦 My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} style={{
          background: "#fff", borderRadius: "12px",
          padding: "20px 24px", marginBottom: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontWeight: "700", fontSize: "17px" }}>
              {order.id}
            </div>
            <div style={{ color: "#777", fontSize: "13px", marginTop: "4px" }}>
              {order.date} · {order.items.length} item(s)
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontWeight: "800", fontSize: "20px", marginBottom: "6px",
            }}>
              ${Number(order.total).toFixed(2)}
            </div>
            <span style={statusStyle(order.status)}>{order.status}</span>
            <div style={{ marginTop: "10px" }}>
              <Link to={`/orders/${order.id}`} style={{
                color: "#7B7FD8", fontWeight: "600",
                fontSize: "13px", textDecoration: "none",
              }}>
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}	 	  	      	 	    	    	    	    	 	
    </div>
  );
}

// ── Order Detail ──────────────────────────────────────────────────────────────
function OrderDetail({ user }) {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const userId    = user?.userId || "guest";
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch this specific order from API
  useEffect(() => {
    fetch(`${API_URL}?id=${id}&userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, userId]);

  if (loading) return (
    <p style={{ padding: "40px" }}>Loading order...</p>
  );

  if (!order) return (
    <div style={{ textAlign: "center", padding: "60px" }}>
      <h2>Order not found</h2>
      <button onClick={() => navigate("/orders")} style={backBtnStyle}>
        ← Back to Orders
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={backBtnStyle}>
        ← Back to Orders
      </button>
      <div style={{	 	  	      	 	    	    	    	    	 	
        background: "#fff", borderRadius: "12px",
        padding: "32px", marginTop: "20px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "24px",
        }}>
          <div>
            <h2 style={{ margin: 0 }}>{order.id}</h2>
            <p style={{ color: "#666", marginTop: "6px" }}>
              Date: {order.date}
            </p>
            <p style={{ color: "#666" }}>
              Items: {order.items.length}
            </p>
          </div>
          <span style={statusStyle(order.status)}>
            Status: <strong>{order.status}</strong>
          </span>
        </div>

        {/* Items list */}
        <strong style={{ fontSize: "15px" }}>Items Ordered</strong>
        <div style={{ marginTop: "12px", marginBottom: "24px" }}>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "10px 0", borderBottom: "1px solid #f0f0f0",
            }}>
              <span>{item.name}</span>
              <span style={{ fontWeight: "700" }}>
                ${Number(item.price).toFixed(2)}
              </span>
            </div>
          ))}	 	  	      	 	    	    	    	    	 	
        </div>

        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: "20px", fontWeight: "800", color: "#1a1a2e",
          paddingTop: "12px", borderTop: "2px solid #ede9ff",
        }}>
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
function OrdersApp({ user }) {
  return (
    <div style={{ padding: "20px" }}>
      <Routes>
        <Route index     element={<OrdersList user={user} />} />
        <Route path=":id" element={<OrderDetail user={user} />} />
      </Routes>
    </div>
  );
}

const backBtnStyle = {
  background: "transparent", border: "2px solid #7B7FD8",
  color: "#7B7FD8", padding: "8px 22px", borderRadius: "8px",
  cursor: "pointer", fontWeight: "600", fontSize: "14px",
};

export default OrdersApp;	 	  	      	 	    	    	    	    	 	
