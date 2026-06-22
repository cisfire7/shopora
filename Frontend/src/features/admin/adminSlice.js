import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= PRODUCTS ================= */

// Fetch all admin products
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/products");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

// Create product
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await axios.post(
        "/api/v1/admin/product/create",
        productData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create product"
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await axios.put(
        `/api/v1/admin/product/${id}`,
        formData,
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update product"
      );
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/admin/product/${productId}`);
      return { productId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete product"
      );
    }
  }
);

/* ================= USERS ================= */

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/users");
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch users");
    }
  }
);

export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/admin/user/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/v1/admin/user/${userId}`, {
        role,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update user role"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/user/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete user"
      );
    }
  }
);

/* ================= ORDERS ================= */

export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/admin/orders");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch orders"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete order"
      );
    }
  }
);

export const adminUpdateOrderStatus = createAsyncThunk(
  "admin/adminUpdateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.put(
        `/api/v1/admin/order/${orderId}`,
        { status },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order"
      );
    }
  }
);

export const getAdminOrderDetails = createAsyncThunk(
  "admin/getAdminOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch order details"
      );
    }
  }
);

/* ================= SLICE ================= */

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    product: {},
    users: [],
    user: {},
    orders: [],
    order: {},
    totalAmount: 0,
    loading: false,
    success: false,
    error: null,
    message: null,
    deleting: {},
  },
  reducers: {
    removeError: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* PRODUCTS */
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        if (action.payload.product) {
          state.products.push(action.payload.product);
        }
        state.success = action.payload.success;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.product = action.payload.product;
        state.success = action.payload.success;
      })

      .addCase(deleteProduct.pending, (state, action) => {
        state.deleting[action.meta.arg] = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload.productId;
        state.deleting[id] = false;
        state.products = state.products.filter((p) => p._id !== id);
      })

      /* USERS */
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
      })

      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
      })

      /* ORDERS */
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.message = action.payload.message;
      })

      .addCase(adminUpdateOrderStatus.fulfilled, (state, action) => {
        state.success = action.payload.success;
        state.order = action.payload.order;
      })

      .addCase(getAdminOrderDetails.fulfilled, (state, action) => {
        state.order = action.payload.order;
      });
  },
});

export const { removeError, removeSuccess, clearMessage } =
  adminSlice.actions;

export default adminSlice.reducer;
