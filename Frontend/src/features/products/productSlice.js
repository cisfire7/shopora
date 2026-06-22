import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get All Products
export const getProduct = createAsyncThunk(
    'product/getProduct',
    async ({ keyword = "", page = 1, category }, { rejectWithValue }) => {
        try {
            let link = `/api/v1/products?page=${page}`;
            if (category) link += `&category=${category}`;
            if (keyword) link += `&keyword=${keyword}`;

            const { data } = await axios.get(link);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Get Product Details
export const getProductDetails = createAsyncThunk(
    'product/getProductDetails',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`/api/v1/product/${id}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Create Review
export const createReview = createAsyncThunk(
    'product/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.put('/api/v1/review', reviewData, config);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Slice
const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        product: {},
        productCount: 0,
        resultsPerPage: 0,
        totalPages: 0,
        loading: false,
        error: null,
        reviewSuccess: false,
        reviewLoading: false
    },
    reducers: {
        removeError: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.reviewSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Products
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.productCount = action.payload.productCount;
                state.resultsPerPage = action.payload.resultsPerPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Product Details
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Review
            .addCase(createReview.pending, (state) => {
                state.reviewLoading = true;
            })
            .addCase(createReview.fulfilled, (state) => {
                state.reviewLoading = false;
                state.reviewSuccess = true;
            })
            .addCase(createReview.rejected, (state, action) => {
                state.reviewLoading = false;
                state.error = action.payload;
            });
    }
});

export const { removeError, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
