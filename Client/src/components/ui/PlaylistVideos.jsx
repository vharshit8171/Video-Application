import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { usePlaylistStore } from "../../../store/PlaylistStore.js";

const PlaylistDetail = () => {
  const navigate = useNavigate();
  const { playlistId } = useParams();

  const currentPlaylist = usePlaylistStore((state) => state.currentPlaylist);
  const getPlaylistById = usePlaylistStore((state) => state.getPlaylistById);
  const deletePlaylist = usePlaylistStore((state) => state.deletePlaylist);
  const removeVideoFromPlaylist = usePlaylistStore((state) => state.removeVideoFromPlaylist);
  const isLoading = usePlaylistStore((state) => state.isLoading);
  const videos = currentPlaylist?.videos ?? [];
  const hasVideos = currentPlaylist?.videos?.length > 0;

  useEffect(() => {
    if (playlistId) {
      getPlaylistById(playlistId);
    }
  }, [getPlaylistById, playlistId]);

  const handledelete = async () => {
    deletePlaylist(currentPlaylist._id);
    navigate("/playlist");
    toast.success("Playlist deleted successfully!!!");
  }

  if (isLoading || !currentPlaylist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading playlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pt-23">
      <div className="max-w-[99vw] mx-auto border border-white/10 rounded-xs overflow-hidden">

        <div className="bg-black/55 px-4 py-4">
          <div className="flex flex-col md:flex-row gap-8 items-start">

            <div className="w-full md:w-96 aspect-[16/10] rounded-xs overflow-hidden bg-gray-800">
                <img src={currentPlaylist?.videos?.[0]?.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c"}
                  alt="error"
                  className="w-full h-full object-cover"/>
            </div>

            <div className="flex flex-col">
              <h1 className="text-4xl font-semibold mb-1">
                {currentPlaylist.name}
              </h1>

              <p className="text-md font-semibold mb-3">
                {currentPlaylist.description || "No description"}
              </p>

              <p className="text-base opacity-70 mb-5">
                {videos.length} videos
              </p>

              <button onClick={handledelete}
              className="px-12 py-3 bg-red-700 cursor-pointer text-white rounded-sm font-medium">
                Delete Playlist
              </button>
            </div>
          </div>
        </div>

        <div className="px-12 py-6">

          {!hasVideos && (
            <div className="flex flex-col items-center justify-center py-24 opacity-70">
              <p className="text-xl mb-2">No videos in this playlist</p>
              <p className="text-sm">
                Add videos to start building your playlist
              </p>
            </div>
          )}

          {hasVideos && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentPlaylist.videos.map((video) => (
                <div
                  key={video._id}
                  className="bg-white/5 border border-white/10
                  rounded-xs overflow-hidden hover:bg-white/10 transition">
                  <div
                    className="aspect-video cursor-pointer"
                    onClick={() => navigate(`/watch/${video._id}`)}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-2">
                    <h3 className="text-lg font-medium line-clamp-2">
                      {video.title}
                    </h3>

                    <p className="text-sm mb-2 line-clamp-2">
                      {video.description || "No description"}
                    </p>

                    <div className="flex items-center justify-between text-sm opacity-70">
                      <span>{video.duration} min</span>
                      <button 
                      onClick={()=>{
                        removeVideoFromPlaylist(currentPlaylist._id,video._id);
                      }} 
                      className="hover:opacity-100 opacity-70 cursor-pointer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PlaylistDetail;
