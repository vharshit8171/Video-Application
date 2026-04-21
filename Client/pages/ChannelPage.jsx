import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Plus, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { useVideoStore } from "../store/videoStore.js";
import { useChannelStore } from "../store/channelStore.js";
import NotFound from "../src/components/ui/NotFound.jsx";
import VideoSkeleton from "../src/components/ui/VideoSkeleton.jsx";
import PageLoader from "../src/components/ui/PageLoader.jsx";
import VideoCard from "../src/components/ui/VideoCard.jsx";
import ConfirmAction from "../src/components/ui/ConfirmAction.jsx";

const ChannelPage = () => {
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const user = useAuthStore((state) => state.user);
  const channel = useChannelStore((state) => state.channel);
  const fetchChannelByHandle = useChannelStore((state) => state.fetchChannelByHandle);
  const isLoading = useChannelStore((state) => state.isLoading);
  const error = useChannelStore((state) => state.error);
  const fetchOwnerVideos = useVideoStore((state) => state.fetchOwnerVideos);
  const isOwnerVideosLoading = useVideoStore((state) => state.isOwnerVideosLoading);
  const ownerVideosOnly = useVideoStore((state) => state.ownerVideosOnly);
  const deleteVideo = useVideoStore((state) => state.deleteVideo);
  const isOwner = user?.channel?._id === channel?._id;

  const { handle } = useParams();
  useEffect(() => {
    fetchChannelByHandle(handle);
  }, [fetchChannelByHandle, handle]);

  useEffect(() => {
    if (channel?.handle) {
      fetchOwnerVideos(channel.handle);
    }
  }, [channel?.handle, fetchOwnerVideos]);

  const requestDelete = (video) => {
    setVideoToDelete(video);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteVideo(channel.handle, videoToDelete._id);
      toast.success("Video Deleted Successfully!!!");
      navigate(`/channel/${user.channel?.handle}`);
      setOpenConfirm(false);
      setVideoToDelete(null);
    } catch (error) {
      toast.error(error);
    }
  };

  if (error === "Channel not found") { return <NotFound />; }
  if (!channel || isLoading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-black text-white">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="relative z-70 w-screen min-h-screen bg-black flex flex-col px-3 sm:px-6 lg:px-4 py-6 sm:py-2">

      <div className="relative">
        <div className="w-full h-56 sm:h-68 md:h-80 bg-zinc-800">
          <img src={channel?.banner || ""}
            alt="Channel Banner"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
          <img src={channel.logo}
            alt="Channel Logo"
            className="w-46 h-46 rounded-full border-4 border-zinc-950 object-cover bg-zinc-800"
          />
        </div>
      </div>

      <div className="mt-14 text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          {channel.name}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          @{channel.handle} • {channel.category}
        </p>
        <p className="max-w-2xl mx-auto text-gray-300 mt-2 text-sm sm:text-base">
          {channel.description}
        </p>

        {isOwner && (
          <div className="mt-2 flex justify-center gap-4 flex-wrap">

            <button
              onClick={() => navigate(`/channel/${channel.handle}/upload`)}
              className="flex items-center gap-1 px-5 py-2.5 cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300">
              <Plus size={18} />
              Upload Video
            </button>

            <button
              onClick={() => navigate(`/channel/${channel.handle}/edit`)}
              className="flex items-center gap-2 px-5 py-2.5
             bg-white/10 hover:bg-white/20 cursor-pointer
             border border-white/20 text-white font-semibold rounded-full transition-all duration-300">
              <Pencil size={16} />
              Edit Channel
            </button>
          </div>
        )}
      </div>

      <div className="mt-2 px-4 sm:px-6 lg:px-0">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          Videos
        </h2>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-1">
          {isOwnerVideosLoading ? (
            <div className="col-span-full flex justify-center py-10">
              <VideoSkeleton />
            </div>
          ) : ownerVideosOnly.length === 0 ? (
            <p className="text-gray-400 col-span-full text-center py-10">No videos uploaded yet.</p>
          ) : (
            ownerVideosOnly.map((video) => (
              <div
                key={video._id}
                className="w-full max-w-full"
              >
                <div className="w-full aspect-video">
                  <VideoCard
                    video={video}
                    onDeleteRequest={requestDelete}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {openConfirm && (
        <ConfirmAction
          title="Delete Video"
          description="Are you sure to delete this video."
          confirmText="Delete"
          onConfirm={handleConfirmDelete}
          setOpenConfirm={setOpenConfirm}
        />
      )}
    </div>
  );
};

export default ChannelPage;