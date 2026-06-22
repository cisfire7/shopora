import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Generate AI Cart
export const generateAICart = createAsyncThunk(
    "ai/generateCart",
    async (prompt, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/v1/ai/cart", { prompt }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to generate AI cart"
            );
        }
    }
);

// Save AI Cart
export const saveAICart = createAsyncThunk(
    "ai/saveCart",
    async (cartId, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/v1/ai/cart/save", { cartId }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to save AI cart"
            );
        }
    }
);

// Regenerate AI Cart
export const regenerateAICart = createAsyncThunk(
    "ai/regenerateCart",
    async (cartId, { rejectWithValue }) => {
        try {
            const { data } = await axios.post("/api/v1/ai/cart/regenerate", { cartId }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to regenerate AI cart"
            );
        }
    }
);

// Get AI Cart History
export const getAIHistory = createAsyncThunk(
    "ai/getHistory",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get("/api/v1/ai/history", {
                withCredentials: true
            });
            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch AI history"
            );
        }
    }
);

// Delete AI Cart
export const deleteAICartAction = createAsyncThunk(
    "ai/deleteCart",
    async (cartId, { rejectWithValue }) => {
        try {
            const { data } = await axios.delete(`/api/v1/ai/cart/${cartId}`, {
                withCredentials: true
            });
            return { ...data, cartId };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete AI cart"
            );
        }
    }
);

const aiSlice = createSlice({
    name: "ai",
    initialState: {
        loading: false,
        error: null,
        currentCart: null,
        history: [],
        success: false,
        message: null
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
            state.message = null;
        },
        clearCurrentCart: (state) => {
            state.currentCart = null;
        }
    },
    extraReducers: (builder) => {
        // Generate AI Cart
        builder
            .addCase(generateAICart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateAICart.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCart = action.payload.aiCart;
                state.success = true;
            })
            .addCase(generateAICart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Save AI Cart
        builder
            .addCase(saveAICart.pending, (state) => {
                state.loading = true;
            })
            .addCase(saveAICart.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCart = action.payload.aiCart;
                state.success = true;
                state.message = "Cart saved successfully";
            })
            .addCase(saveAICart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Regenerate AI Cart
        builder
            .addCase(regenerateAICart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(regenerateAICart.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCart = action.payload.aiCart;
                state.success = true;
                state.message = "Cart regenerated with new suggestions";
            })
            .addCase(regenerateAICart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Get History
        builder
            .addCase(getAIHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAIHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload.aiCarts;
            })
            .addCase(getAIHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Delete AI Cart
        builder
            .addCase(deleteAICartAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteAICartAction.fulfilled, (state, action) => {
                state.loading = false;
                state.history = state.history.filter(c => c._id !== action.payload.cartId);
                state.success = true;
                state.message = "AI Cart deleted";
            })
            .addCase(deleteAICartAction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { removeError, removeSuccess, clearCurrentCart } = aiSlice.actions;
export default aiSlice.reducer;
