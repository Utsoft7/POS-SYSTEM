import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSlice";
import customerSlice from "./slices/customerSlice";
import userSlice from "./slices/userSlice";

const store = configureStore({
  reducer: {
    customer: customerSlice,
    cart: cartSlice,
    user: userSlice,
  },

  devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
