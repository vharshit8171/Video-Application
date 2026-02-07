import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {LogOut, Pencil, ArrowDownToLine, FolderCog,
  Podcast, BadgeInfo, HeartPlus} from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import { useChannelStore } from "../store/channelStore.js";
import { useVideoStore } from "../store/videoStore.js";
import ConfirmAction from "../src/components/ui/ConfirmAction.jsx";
import VideoCard from "../src/components/ui/VideoCard.jsx";

const Profile = () => {
  const navigate = useNavigate();
  const [OpenConfirm, setOpenConfirm] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const watchHistory = useAuthStore((state) => state.watchHistory);
  const fetchWatchHistory = useAuthStore((state) => state.fetchWatchHistory);
  const resetChannel = useChannelStore((state) => state.resetChannel);
  const resetVideo = useVideoStore((state) => state.resetVideo);

  useEffect(() => {
    fetchWatchHistory();
  }, [fetchWatchHistory]);

  const handleSubmit = async () => {
    await logout();
    toast.success("Logged Out Successfully");
    setOpenConfirm(false);
    navigate("/");
  };

  const handleDelete = async () => {
    const success = await deleteAccount();
    if (success) {
      resetChannel();
      resetVideo();
      toast.success("Account Deleted Successfully!!!");
      navigate("/");
    }
  };

  return (
    <div className="w-screen min-h-screen bg-black flex justify-center px-3 sm:px-6 lg:px-10 py-6">
      <div className="w-full max-w-md sm:max-w-2xl lg:max-w-7xl bg-zinc-900/60 backdrop-blur rounded-xs shadow-2xl mt-10 md:mt-20 xl:mt-12 p-4 sm:p-6 lg:pl-10">

        <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-10 text-center lg:text-left">
          <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full overflow-hidden border border-slate-900">
            <img src={user?.avatar || "/defaultAvatar.png"}
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col items-center lg:items-start">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {user.username}
            </h2>
            <p className="text-xs sm:text-base md:text-lg text-zinc-400">
              {user.email}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-3">
              <button onClick={() => navigate("/update-Profile")}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-zinc-300 text-zinc-900 rounded-xs hover:bg-zinc-400"
              >
                <Pencil size={16} className="inline mr-1" />
                Edit Profile
              </button>

              <button
                onClick={() => setOpenConfirm(true)}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-red-500 text-white rounded-xs hover:bg-red-600">
                Delete Account
              </button>
            </div>

            {OpenConfirm && (
              <ConfirmAction title="Delete Account?"
                setOpenConfirm={setOpenConfirm}
                description="Are you sure you want to delete your account."
                confirmText="Delete"
                onConfirm={handleDelete}
              />
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4 text-center">
          {[
            { label: "Hours Watched", value: "12" },
            { label: "Watchlist", value: watchHistory.length },
            { label: "Liked", value: "43" },
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-800 rounded-xs p-3 sm:p-4">
              <p className="text-lg sm:text-2xl font-semibold text-white">
                {item.value}
              </p>
              <p className="text-[10px] sm:text-sm text-zinc-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base sm:text-xl font-semibold text-white">
              My Watchlist
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">
            {watchHistory.map(item => (
              <VideoCard key={item.video._id} video={item.video} variant="compact" />
            ))}
          </div>
        </div>

        <div className="mt-7 border-t border-zinc-800 pt-5">
          <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
            <li onClick={()=>{navigate("/playlist")}} 
            className="hover:text-white"><FolderCog size={16} className="inline mr-2 cursor-pointer" /> My Playlist</li>
            <li className="hover:text-white"><ArrowDownToLine size={16} className="inline mr-2" /> Downloads</li>
            <li className="hover:text-white"><HeartPlus size={16} className="inline mr-2" /> Liked</li>
            <li className="hover:text-white"><Podcast size={16} className="inline mr-2" /> Subscription</li>
            <li className="hover:text-white"><BadgeInfo size={16} className="inline mr-2" /> Help</li>
          </ul>

          <button
            onClick={handleSubmit}
            className="mt-5 w-full py-2 flex justify-center items-center gap-2 text-xs sm:text-lg cursor-pointer font-semibold rounded-xs bg-slate-300 hover:bg-slate-400 text-slate-800">
            <LogOut size={18} />
            Logout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
