import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


// Add item to cart
export const addItemsToCart = createAsyncThunk(
    'cart/addItemsToCart',
    async ({ id, quantity }, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/product/${id}`);
            
            return {
                product: data.product._id,
                name: data.product.name,
                price: data.product.price,
                // Backend fields check (image vs images)
                image: data.product.image?.[0]?.url || data.product.images?.[0]?.url,
                stock: data.product.stock || data.product.Stock, 
                quantity
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: JSON.parse(localStorage.getItem('cartItems')) || [], // Direct load from storage
        loading: false,
        error: null,
        success: false,
        message: null,
        removingId: null,
        shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {}


    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeMessage: (state) => {
            state.message = null;
            state.success = false;
        },
        removeItemFromCart: (state, action) => {
            state.removingId = action.payload;
            state.cartItems = state.cartItems.filter((item) => item.product !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            state.removingId = null;
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
        },
        clearCart:(state) =>{
            state.cartItems = [],
            localStorage.removeItem('cartItem');
            localStorage.removeItem('shippingInfo');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemsToCart.pending, (state) => {
                state.loading = true;
            })
.addCase(addItemsToCart.fulfilled, (state, action) => {
    const item = action.payload;
    const existingItem = state.cartItems.find((i) => i.product === item.product);

    if (existingItem) {
        existingItem.quantity = item.quantity;
    } else {
        state.cartItems.push(item);
    }

    try {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
        console.log("Successfully saved to LocalStorage");
    } catch (err) {
        console.error("LocalStorage Save Error:", err);
    }

    state.loading = false;
    state.success = true;
    state.message = "Cart updated successfully";
})
            .addCase(addItemsToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { removeError, removeMessage , removeItemFromCart , saveShippingInfo , clearCart } = cartSlice.actions;
export default cartSlice.reducer;