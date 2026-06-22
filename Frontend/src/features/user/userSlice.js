import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";


//Registration aPI
export const register=createAsyncThunk('user/register',async(userData , {rejectWithValue})=>{
    try{
       const config={
           headers: {
               'Content-Type': 'multipart/form-data'
           }
       }
       const {data} = await axios.post('/api/v1/register',userData,config);
       console.log('Registeration Success',data);
       return data
    }
    catch(error){
        return rejectWithValue(error.response?.data || 'Registration Failed. Please Try Again')
    }
})
//login aPI

export const login = createAsyncThunk('user/login', async (loginData, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        // Use loginData here, not userData
        const { data } = await axios.post('/api/v1/login', loginData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login Failed');
    }
});

//load User

export const loadUser = createAsyncThunk('user/loadUser', async (_,{ rejectWithValue }) => {
    try {
        const { data } = await axios.get('/api/v1/profile');
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to load user');
    }
});
//logout user

export const logout = createAsyncThunk('user/logout', async (_,{ rejectWithValue }) => {
    try {
        const { data } = await axios.post('/api/v1/logout',{withCredentials:true});
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to logout' );
    }
});

// Update Profile API
export const updateProfile = createAsyncThunk('user/updateProfile', async (userData,{ rejectWithValue }) => {
    try {
            const config={
           headers: {
               'Content-Type': 'multipart/form-data'
           }
       }
        const { data } = await axios.put('/api/v1/profile/update',userData,config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Update Profile' );
    }
});
// Update Password API
export const updatePassword = createAsyncThunk('user/updatePassword', async (formData,{ rejectWithValue }) => {
    try {
            const config={
           headers: {
               'Content-Type': 'application/json'
           }
       }
        const { data } = await axios.put('/api/v1/password/update',formData,config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Update Profile' );
    }
});

// Forgot Password API
export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email,{ rejectWithValue }) => {
    try {
            const config={
           headers: {
               'Content-Type': 'application/json'
           }
       }
        const { data } = await axios.post('/api/v1/forgot/password',email,config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Update Password' );
    }
});

// Reset Password
export const resetPassword = createAsyncThunk('user/resetPassword', async ({token, userData}, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        // URL ko backend route se match karein
        const { data } = await axios.put(`/api/v1/reset/${token}`, userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to Reset Password');
    }
});




const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: null,
        isAuthenticated: localStorage.getItem('isAuthenticated') || false,
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        success: false,
        message: null 
    },
    reducers: {
        removeError: (state) => {
            state.error = null
        },
        removeSuccess: (state) => {
            state.success = false
        }
    },

   
    extraReducers: (builder) => {
         // Registration Process
        builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload?.user || null;
            state.success = action.payload.success;
            state.isAuthenticated = Boolean(action.payload?.user);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Registration Failed. Please Try Again";
            state.user = null ;
            state.isAuthenticated = false;
        })
        // Login process
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload?.user || null;
            state.success = action.payload.success
            state.isAuthenticated = Boolean(action.payload?.user);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Login Failed. Please Try Again";
            state.user = null ;
            state.isAuthenticated = false;
        })
        // loadUser
        .addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload?.user || null;
            state.isAuthenticated = Boolean(action.payload?.user);
        })
        .addCase(loadUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to load user. Please Try Again";
            state.user = null ;
            state.isAuthenticated = false;
            if(action.payload?.statusCode === 401){
                state.user = null ;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            }
        })
        // logout
        .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to logout user. Please Try Again";
        })
        // updateProfile
            .addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload?.user || null;
            state.success = action.payload?.success;
            state.message = action.payload?.message
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to update profile. Please Try Again";
        })
        // updatePassword
            .addCase(updatePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload?.success;
        })
        .addCase(updatePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Email sent failed";
        })
            // forgotPassword
            .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload?.success;
            state.message = action.payload?.message
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Email sent failed";
        })
        // resetPassword
        .addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload?.success;
            state.user = null ;
            state.isAuthenticated = false;
        })
        .addCase(resetPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Email sent failed";
        })
    }
})

export const { removeError, removeSuccess } = userSlice.actions;
export default userSlice.reducer;