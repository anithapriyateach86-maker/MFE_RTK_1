// orders-mfe/src/store/orderStore.js
import { create } from "zustand";

/**
 * Zustand orderStore — shared state for orders
 * 
 * WHY ZUSTAND:
 * - Simpler than Redux
 * - No Provider wrapper needed
 * - Works as singleton across MFEs when shared via Module Federation
 * 
 * SINGLETON RULE:
 * webpack.config.js must have zustand: { singleton: true }
 * so all MFEs share ONE instance of this store
 */

const useOrderStore = create((set, get) => ({
  // State
  orders: [],
  isLoading: false,

  // Action: add a new order after checkout
  addOrder: (orderData) => {
    const newOrder = {
      id: `ORD${String(Date.now()).slice(-4)}`,  // e.g. ORD5823
      date: new Date().toLocaleDateString("en-IN"),
      items: orderData.items || [],
      total: orderData.total || 0,
      status: "Processing",
    };

    set((state) => ({
      orders: [newOrder, ...state.orders],  // newest first
    }));

    console.log("[OrderStore] New order added:", newOrder);
  },

  // Action: update order status
  updateOrderStatus: (id, status) => {	 	  	      	 	    	    	    	    	 	
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, status } : o
      ),
    }));
  },

  // Getter
  getOrders: () => get().orders,
}));

export default useOrderStore;