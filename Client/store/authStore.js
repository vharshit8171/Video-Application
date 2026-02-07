import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
    user: null,
    watchHistory:[],
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAuthChecked: false,
    isAccountDeleted:false,
    profileUpdated: false,

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/register', userData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            set({
                user: response.data.data,
                isAuthenticated: true,
                isLoading: false,
                isAuthChecked: true,
                error: null,
            });
        }
        catch (error) {
            set({
                isLoading: false,
                error: error.response ? error.response.data.message : error.message,
            });
        }
    },

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post('http://localhost:5000/api/v1/user/login', credentials, { withCredentials: true });
            set({
                user: response.data.data,
                isAuthenticated: true,
                isLoading: false,
                isAuthChecked: true,
                error: null,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response ? error.response.data.message : error.message,
            });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post('http://localhost:5000/api/v1/user/logout', {}, { withCredentials: true });
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isAuthChecked: true,
                error: null,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response ? error.response.data.message : error.message,
            })
        }
    },

    // I initially had a verifyJWT middleware that was strict
    // → it expected a token every time and threw an error if missing.
    // I used this same middleware for /auth/me(auth check on app load).
    // → For new users(no token), backend returned an error.
    // → Frontend showed error toasts on every route change.
    // I thought the issue was App.jsx re - rendering,
    //     but learned that re - render ≠ remount, and the real issue was auth logic, not React.
    // I realized that not having a token is a valid state, not an error.
    // So I created a new middleware(attachUser):
    // If token exists → verify it and attach user
    // If token does not exist or is invalid → set req.user = null
    // Never throw error in this middleware
    // I kept verifyJWT(or refactored it) as a strict auth middleware
    // → used only for protected routes like update profile, change password, etc.
    // Then I updated / auth / me to use optional auth:
    // It always returns 200 OK
    // Response contains { user: null } or { user: userObject }
    // A new problem appeared:
    // → Frontend treated 200 OK as authenticated, even when user was null.
    // I understood the key rule:
    // Authentication depends on user existence, not API success.
    // I fixed Zustand authMe logic:
    // Extracted user properly from response
    // Set:
    // isAuthenticated = Boolean(user)
    // Stored only the actual user object or null, not wrapper data
    // After this:
    // New users stay unauthenticated
    // Logged -in users are detected correctly
    // No error toasts on app load
    // Auth flow became clean and predictable

    authMe: async () => {
        const { isAuthChecked } = useAuthStore.getState();
        if (isAuthChecked) return;

        set({ isLoading: true, error: null });
        try {
            const response = await axios.get('http://localhost:5000/api/v1/auth/me', { withCredentials: true });
            const user = response.data?.data?.user || null;
            set({
                user,
                isAuthenticated: Boolean(user),
                isLoading: false,
                isAuthChecked: true,
                error: null,
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isAuthChecked: true,
                error: error.response ? error.response.data.message : error.message,
            });
        }
    },

    updateProfile: async (formData) => {
        set({ isLoading: true, error: null, profileUpdated: false });
        try {
            const res = await axios.patch("http://localhost:5000/api/v1/user/updateCredentials", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            set({
                user: res.data.data,
                isLoading: false,
                profileUpdated: true,
            });
        } catch (err) {
            set({
                isLoading: false,
                error: err.response?.data?.message || "Update failed",
            });
        }
    },

    deleteAccount: async () => {
        set({ isLoading: true, error: null })
        try {
            await axios.delete("http://localhost:5000/api/v1/user/delete-account", {
                withCredentials: true
            });
            set({
                user: null,
                isAuthenticated: false,
                isAuthChecked: false,
                isLoading: false,
                isAccountDeleted:true
            })
            return true
        } catch (error) {
            set({
                isLoading: false,
                error: error.response ? error.response.data.message : error.message,
            });
            return false
        }
    },

    fetchWatchHistory: async () => {
        set({isLoading:true,error:null});
        try {
            const res = await axios.get("http://localhost:5000/api/v1/user/history",{
                withCredentials:true
            });
            set({
                isLoading:false,
                watchHistory:res.data.data.user.watchHistory,
            })
        } catch (err) {
              set({
                isLoading: false,
                error: err.response?.data?.message || "Update failed",
            });
        }
    },
 

    resetProfileUpdated: () => set({ profileUpdated: false }),

}));