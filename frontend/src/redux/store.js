import {configureStore} from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "cart",  
  storage,      
};
const persistedCartReducer = persistReducer(persistConfig, cartSlice);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  },
});
export const persistor = persistStore(store);
export default store;