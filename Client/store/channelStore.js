import { create } from "zustand";
import axios from "axios";

export const useChannelStore = create((set, get) => ({
  channel: null,
  isChannelChecked: false,
  isChannelCreated: false,
  isLoading: false,
  error: null,

  createChannel: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.post("http://localhost:5000/api/v1/channel/create", formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({
        channel: res.data.data,
        isChannelCreated: true,
        isChannelChecked: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Channel creation failed",
      });
    }
  },

  // This controller is built to solve the same problem we face in auth when we refresh the pages and similarly runs as authme when app loads again.
  getMyChannel: async () => {
    const { isChannelChecked } = get();
    if (isChannelChecked) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/channel/auth",
        {withCredentials:true}
      );
      set({
        channel: res.data?.data || null,
        isChannelChecked: true,
        isLoading: false
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch channel",
        isChannelChecked: true,
        isLoading: false
      });
    }
  },

  fetchChannelByHandle: async (handle) => {
    try {
      set({ isLoading: true });
      const res = await axios.get(`http://localhost:5000/api/v1/channel/${handle}`);

      set({
        channel: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch channel",
        isLoading: false,
      });
    }
  },

  editChannel: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await axios.patch(`http://localhost:5000/api/v1/channel/${formData.handle}/edit`, formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({
        channel: res.data.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Channel editing failed",
      });
    }
  },

  deleteChannel: async (handle) => {
  try {
    set({ isLoading: true, error: null });
    await axios.get(
      `http://localhost:5000/api/v1/channel/${handle}/delete`,
      { withCredentials: true }
    );
    set({
      channel: null,
      ownerVideosOnly: [],
      isChannelCreated: false,
      isChannelChecked: true, // important: we already know user has NO channel now
      isLoading: false,
      error: null,
    });

  } catch (err) {
    set({
      isLoading: false,
      error: err.response?.data?.message || "Failed to delete channel",
    });
  }
},

  // Without reset:
  // You visit the page again
  // isChannelCreated === true
  // Effect runs again ❌
  // Toast + navigation loop ❌
  // RESET (logout or switch channel)
  resetChannel: () => {
    set({ channel: null, isChannelCreated: false, isChannelChecked:false, error: null });
  },
}));
