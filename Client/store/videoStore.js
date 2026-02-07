import { create } from "zustand";
import axios from "axios";

export const useVideoStore = create((set) => ({
    totalPages: 0,
    homeVideos: [],
    ownerVideosOnly: [],
    searchedVideos:[],
    isOwnerVideosLoading: false,
    recommendedVideos:[],
    isrecommendedLoading:false,
    currentVideo: null,
    isLoading: false,
    error: null,

    fetchHomeVideos: async (currentPage = 1, videosPerPage = 8) => {
        set({ isLoading: true, error: null });
        try {
            const homeVideo = await axios.get(`http://localhost:5000/api/v1/video/getAllVideos?page=${currentPage}&limit=${videosPerPage}`, { withCredentials: true });
            set({
                homeVideos: homeVideo.data.data.videos,
                totalPages: homeVideo.data.data.totalPages,
                isLoading: false,
                error: null
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response ? error.response.data.message : error.message,
            })
        }
    },

    fetchOwnerVideos: async (handle) => {
        set({ isOwnerVideosLoading: true, error: null });
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/video/channel/${handle}/videos`);
            set({
                isOwnerVideosLoading: false,
                ownerVideosOnly: res.data.data,
            });
        } catch (error) {
            set({
                isOwnerVideosLoading: false,
                error: error.response?.data?.message || "Failed to fetch owner's videos",
            });
        }
    },

    uploadVideo: async (handle, formData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`http://localhost:5000/api/v1/video/${handle}/publishVideo`, formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                });
            set((state) => ({
                isLoading: false,
                homeVideos: [res.data.data, ...state.homeVideos],
                ownerVideosOnly: [res.data.data, ...state.ownerVideosOnly],
            }));
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to upload video",
            })
        }
    },

    editVideo: async (formData, videoId, handle) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.patch(
                `http://localhost:5000/api/v1/video/${handle}/updateVideo/${videoId}`, formData,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
            set((state) => ({
                isLoading: false,
                homeVideos: state.homeVideos.map(v => v._id === videoId ? res.data.data : v),
                ownerVideosOnly: state.ownerVideosOnly.map(v => v._id === videoId ? res.data.data : v),
                currentVideo: state.currentVideo?._id === videoId ? res.data.data : state.currentVideo,
            }));
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to edit video",
            })
        }
    },

    getVideoById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/video/getVideo/${id}`, {
                withCredentials: true,
            });
            set({
                isLoading: false,
                currentVideo: res.data.data,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to fetch video",
            })
        }
    },

    getSearchVideos: async (searchQuery) => {
        set({isLoading:true,error:null});
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/video/search?q=${encodeURIComponent(searchQuery)}&page=1&limit=8`);
            set({
                isLoading:false,
                searchedVideos:res.data.data.videos,
            });
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to fetch video",
            })
        }
    },

    deleteVideo: async (handle, videoId) => {
        set({ isLoading: true });
        try {
            await axios.get(`http://localhost:5000/api/v1/video/${handle}/deleteVideo/${videoId}`, { withCredentials: true });
            set((state) => ({
                isLoading: false,
                homeVideos: state.homeVideos.filter(v => v._id !== videoId),
                ownerVideosOnly: state.ownerVideosOnly.filter(v => v._id !== videoId),
                currentVideo: state.currentVideo?._id === videoId ? null : state.currentVideo,
            }))
        } catch (error) {
            set({
                isLoading: false,
                error: error.response?.data?.message || "Failed to delete video",
            })
        }
    },

    getRecommendedVideos: async(videoId) => {
        set({isrecommendedLoading:true,error:null})
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/video/recommended/${videoId}`,{
                withCredentials:true
            });
            set({
                isrecommendedLoading:false,
                recommendedVideos:res.data.data.uniqueVideos
            })
        } catch (error) {
           set({
                isrecommendedLoading: false,
                error: error.response?.data?.message || "Failed to fetch suggested video",
            }) 
        }
    },

    resetVideo: () => {
        set({
            homeVideos: [],
            ownerVideosOnly: [],
            recommendedVideos:[],
            currentVideo: null,
            totalPages: 0,
        });
    }

}))
