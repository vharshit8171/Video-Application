import { create } from "zustand";
import axios from "axios";

export const usePlaylistStore = create((set, get) => ({
    playlists: [],
    currentPlaylist: [],
    isLoading: false,
    error: null,

    fetchUserPlaylist: async () => {
        try {
            set({ isLoading: true, error: null });

            const res = await axios.get("http://localhost:5000/api/v1/playlist/user/my", { withCredentials: true });
            set({
                playlists: res.data.data,
                isLoading: false,
            });
        } catch (error) {
            set({
                error:
                    error.response?.data?.message ||
                    "Failed to fetch playlists",
                isLoading: false,
            });
        }
    },

    createPlaylist: async ({ name, description }) => {
        try {
            set({ isLoading: true, error: null });

            const res = await axios.post(`http://localhost:5000/api/v1/playlist/create-playlist/:userId`, { name, description },
                { withCredentials: true });

            const newPlaylist = res.data.data;
            set({
                playlists: [newPlaylist, ...get().playlists],
                isLoading: false,
            });
            return true;
        } catch (error) {
            set({
                error: error.response?.data?.message ||
                    "Failed to create playlist",
                isLoading: false,
            });
            return false;
        }
    },

    getPlaylistById: async (playlistId) => {
        try {
            set({ isLoading: true, error: null, currentPlaylist: null });
            const res = await axios.get(`http://localhost:5000/api/v1/playlist/getplaylist/${playlistId}`,
                { withCredentials: true });

            set({
                currentPlaylist: res.data.data,
                isLoading: false,
            });

            return res.data.data;
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to fetch playlist",
                isLoading: false,
                currentPlaylist: null,
            });
            return null;
        }
    },

    addVideoToPlaylists: async (videoId,playlistIds) => {
        try {
            set({isLoading:true})
            const res = await axios.patch(`http://localhost:5000/api/v1/playlist/${videoId}/add-video`,
                {playlistIds},
                {withCredentials:true}
            );
            console.log("res",res);
            set({
                isLoading:false
            })
        } catch (error) {
           set({
                error: error.response?.data?.message || "Failed to add video",
                isLoading: false,
            }); 
        }
    },

    removeVideoFromPlaylist: async (playlistId,videoId) => {
        try {
            set({isLoading:true});
            const res = await axios.patch(`http://localhost:5000/api/v1/playlist/${playlistId}/remove-video/${videoId}`,
            {},    
            {withCredentials:true});
            const updatedPlaylist = res.data.data;
            set((state)=>({
                isLoading: false,
                currentPlaylist: updatedPlaylist,
                playlists: state.playlists.map((pl) =>
                    pl._id === playlistId
                        ? { ...pl, videos: updatedPlaylist.videos }
                        : pl
                ),
            }))
        } catch (error) {
            set({
                error: error.response?.data?.message || "Failed to add video",
                isLoading: false,
            });
        }
    },

    deletePlaylist: async (playlistId) => {
        try {
            set({ isLoading: true });
            await axios.delete(`http://localhost:5000/api/v1/playlist/delete-playlist/${playlistId}`,
                { withCredentials: true }
            );
            set((state) => ({
                playlists: state.playlists.filter(
                    (p) => p._id !== playlistId
                ),
                currentPlaylist: null,
                isLoading: false,
            }));
        } catch (error) {
            set({ isLoading: false });
            console.error(error);
        }
    },

}));
