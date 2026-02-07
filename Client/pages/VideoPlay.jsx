import axios from "axios";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import PageLoader from "../src/components/ui/PageLoader.jsx";
import SavevideoModel from "../src/components/ui/SavevideoModel.jsx";
import RecommendedVideos from "../src/components/ui/RecommendedVideos.jsx";
import { useAuthStore } from "../store/authStore.js";
import { useVideoStore } from "../store/videoStore.js";
import { usePlaylistStore } from "../store/PlaylistStore.js";

const VideoPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openSaveModal, setOpenSaveModal] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentVideo = useVideoStore((state) => state.currentVideo);
  const getVideoById = useVideoStore((state) => state.getVideoById);
  const isLoading = useVideoStore((state) => state.isLoading);
  const fetchUserPlaylist = usePlaylistStore((state) => state.fetchUserPlaylist)

  useEffect(() => {
    const updateWatch = async () => {
      if (id && isAuthenticated) {
        await axios.post(`http://localhost:5000/api/v1/user/history/${id}`, {}, {
          withCredentials: true
        });
      }
    }

    getVideoById(id);
    updateWatch();
  }, [id, isAuthenticated, getVideoById]);

  if (isLoading || !currentVideo) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg"><PageLoader /></div>
      </div>
    );
  }
  return (
    <div className="bg-black min-h-screen pt-16 overflow-x-hidden ">
      <div className="relative h-[70vh] xl:h-[85vh] w-full bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${currentVideo.thumbnail})`,
        }}>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative z-10 h-full flex items-end">
          <div className="px-8 sm:px-12 pb-42 max-w-3xl">

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {currentVideo.title}
            </h1>

            <p className="mt-3 text-gray-300 text-lg sm:text-md line-clamp-3">
              {currentVideo.description}
            </p>

            <p className="mt-1 text-md flex justify-start items-center gap-5 text-gray-300">
              <span>{currentVideo.category && ` • ${currentVideo.category}`}</span>
              <span>{new Date(currentVideo.createdAt).toDateString()}</span>
            </p>

            <div className="mt-6 flex gap-2 xl:gap-4 flex-wrap">
              <button
                onClick={() => navigate(`/watch/${currentVideo._id}`)}
                className="px-5 py-2 xl:px-18 xl:py-3 bg-zinc-600 text-white rounded-xs cursor-pointer text-2xl hover:text-black hover:scale-[1.1] font-semibold hover:bg-gray-200 transition"> Watch </button>

              <button onClick={() => {
                fetchUserPlaylist();
                setOpenSaveModal(true) }}
                className="w-12 h-12 xl:w-14 xl:h-14 flex items-center justify-center bg-zinc-600 cursor-pointer text-white rounded-full hover:bg-white hover:text-black hover:scale-[1.1] transition">
                <Bookmark size={32} />
              </button>

              <button
                className="w-12 h-12 xl:w-14 xl:h-14 flex items-center justify-center bg-zinc-600 cursor-pointer text-white rounded-full hover:bg-white hover:text-black hover:scale-[1.1] transition">
                <ThumbsUp size={32} />
              </button>

              <button
                className="w-12 h-12 xl:w-14 xl:h-14 flex items-center justify-center bg-zinc-600 cursor-pointer text-white rounded-full hover:bg-white hover:text-black hover:scale-[1.1] transition">
                <ThumbsDown size={32} />
              </button>

            </div>
          </div>
        </div>
      </div>

      <SavevideoModel
        isOpen={openSaveModal}
        onClose={() => setOpenSaveModal(false)}
        videoId={currentVideo._id}
        videoTitle={currentVideo.title}
      />

      <div className="px-4 sm:px-8">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
          Customers Also Watched
        </h2>
        <RecommendedVideos videoId={id} />
      </div>
    </div>
  );
};

export default VideoPlay;
