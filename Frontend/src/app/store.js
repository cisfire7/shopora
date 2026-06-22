import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice"
import orderReducer from "../features/order/orderSlice"
import adminReducer from "../features/admin/adminSlice"
import aiReducer from "../features/ai/aiSlice"

const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer,
        cart: cartReducer,
        order: orderReducer,
        admin: adminReducer,
        ai: aiReducer
    }
});

export default store