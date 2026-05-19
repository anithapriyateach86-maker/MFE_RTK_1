// profile-mfe/src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { fashionApi } from "./fashionApi";

/**
 * Redux store with RTK Query middleware
 * 
 * RTK Query handles:
 * - Caching (no repeated API calls)
 * - Loading/error states automatically
 * - Cache invalidation after mutations
 * - Background refetching
 */
export const store = configureStore({
  reducer: {
    // RTK Query reducer — manages all API cache
    [fashionApi.reducerPath]: fashionApi.reducer,
  },
  // RTK Query middleware — handles cache lifetime, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fashionApi.middleware),
});