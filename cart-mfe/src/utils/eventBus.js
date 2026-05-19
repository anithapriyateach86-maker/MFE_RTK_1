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

const eventBus = {
  // Publish an event with optional data payload
  publish(eventName, data) {
    const event = new CustomEvent(eventName, {
      detail: data,        // data is wrapped in event.detail
      bubbles: true,       // bubbles up the DOM
    });
    window.dispatchEvent(event);
    console.log(`[EventBus] Published: ${eventName}`, data);
  },

  // Subscribe to an event — returns the handler for cleanup
  subscribe(eventName, handler) {
    const wrapper = (e) => handler(e.detail);  // unwrap detail for caller
    window.addEventListener(eventName, wrapper);
    console.log(`[EventBus] Subscribed: ${eventName}`);
    return wrapper;  // return so caller can unsubscribe later
  },

  // Unsubscribe to prevent memory leaks
  unsubscribe(eventName, handler) {
    window.removeEventListener(eventName, handler);
    console.log(`[EventBus] Unsubscribed: ${eventName}`);
  },
};

// Event name constants — avoids typos across MFEs
export const EVENTS = {	 	  	      	 	    	    	    	    	 	
  ADD_TO_CART:     "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  ORDER_PLACED:    "ORDER_PLACED",
  COUPON_APPLIED:  "COUPON_APPLIED",
};

export default eventBus;