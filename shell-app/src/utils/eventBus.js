// shell/src/utils/eventBus.js

/**
 * EventBus — lightweight publish/subscribe system
 * 
 * HOW IT WORKS:
 * - publish(event, data)      → fires an event with data
 * - subscribe(event, handler) → listens for an event
 * - unsubscribe(event, handler) → stops listening
 * 
 * Uses native browser CustomEvent so NO direct imports between MFEs needed.
 * Any MFE can publish or subscribe independently.
 */

// shell/src/utils/eventBus.js
const eventBus = {
  publish(eventName, data) {
    const event = new CustomEvent(eventName, {
      detail: data,
      bubbles: true,
    });
    window.dispatchEvent(event);
    console.log(`[EventBus] Published: ${eventName}`, data);
  },

  subscribe(eventName, handler) {
    const wrapper = (e) => handler(e.detail);
    window.addEventListener(eventName, wrapper);
    return wrapper;
  },

  unsubscribe(eventName, handler) {
    window.removeEventListener(eventName, handler);
  },
};

export const EVENTS = {	 	  	      	 	    	    	    	    	 	
  ADD_TO_CART:      "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  ORDER_PLACED:     "ORDER_PLACED",
  COUPON_APPLIED:   "COUPON_APPLIED",
};

export default eventBus;