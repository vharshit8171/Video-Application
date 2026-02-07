import { useState } from "react";
import SearchBar from "./SearchBar";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore.js";
import ConfirmAction from "../ui/ConfirmAction.jsx";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Menu, Upload, CircleUserRound, LogOut } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const isLandingPage = location.pathname === "/";
  const isWatchPage = location.pathname.startsWith("/watch/");

  const handleLogOut = async () => {
    await logout();
    toast.success("Logged Out Successfully");
    navigate("/");
  };

  if (isWatchPage) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
      <div
        className="w-[95vw] h-[7vh] sm:h-[8vh] md:h-[9vh] lg:h-[8vh] xl:h-[12vh] flex justify-between items-center
          px-2 sm:px-4 bg-[#0a0a0a]/75 backdrop-blur-xl
          border-2 border-white/10 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated && (
            <Link to="/menu" className="cursor-pointer">
              <Menu className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 cursor-pointer" />
            </Link>
          )}

          <Link to="/" className="select-none cursor-pointer">
            <h1
              className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c7d2fe] via-white to-[#8678f9] text-[1.25rem] sm:text-xl md:text-4xl lg:text-[2.1rem] whitespace-nowrap tracking-wide"
              style={{ fontFamily: '"Permanent Marker", cursive' }}>
              StreamingVerse
            </h1>
          </Link>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2 sm:gap-3 md:gap-2">
            <div className="hidden lg:flex cursor-pointer">
              <SearchBar />
            </div>

            <Link to="/profile" className="cursor-pointer">
              <img
                src={user?.avatar || "/defaultAvatar.png"}
                alt="User"
                className="hidden lg:block w-10 h-10 md:w-14 md:h-14 rounded-full object-cover border border-white/30 cursor-pointer"
              />
            </Link>

            {user?.channel ? (
              <Link to={`/channel/${user.channel?.handle}`} className="cursor-pointer">
                <button className="hidden xl:flex items-center gap-1.5 px-2.5 py-2.5 text-white border border-slate-800 rounded-full cursor-pointer">
                  <CircleUserRound size={22} />
                  My Channel
                </button>
              </Link>
            ) : (
              <Link to="/upload/create" className="cursor-pointer">
                <button className="hidden xl:flex items-center gap-1.5 px-2.5 py-2.5 text-white border border-white/20 rounded-xs cursor-pointer">
                  <Upload size={18} />
                  Create
                </button>
              </Link>
            )}

            <button
              onClick={() => setOpenConfirm(true)}
              className="flex items-center gap-1 px-2 py-2 sm:px-3 sm:py-2 md:px-4 md:py-3 text-sm sm:text-base md:text-lg text-black border border-white/20 rounded-xs cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 bg-white/70 font-semibold backdrop-blur-md shadow-[0_8px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_14px_40px_rgba(168,85,247,0.45)]">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {openConfirm && (
              <ConfirmAction
                title="Logout?"
                description="You will be logged out from your account."
                confirmText="Logout"
                setOpenConfirm={setOpenConfirm}
                onConfirm={handleLogOut}
              />
            )}
          </div>
        )}

        {!isAuthenticated && isLandingPage && (
          <Link to="/login" className="cursor-pointer">
            <button
              className="px-3 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-xl font-semibold text-black border border-white/20 rounded-xs cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 bg-white/70 backdrop-blur-md shadow-[0_8px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_14px_40px_rgba(168,85,247,0.45)]">
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
