import { configureStore } from "@reduxjs/toolkit";
import user from "./user";

const store = configureStore({
  reducer: {
    user, //  user: user
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
