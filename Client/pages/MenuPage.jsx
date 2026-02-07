import { X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore.js";

const MenuPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navItems = ["Home", "Profile", "Upload","About"];

  const handleNavigation = (item) => {
    if (item === "Upload") {
      if (!isAuthenticated) {
        navigate("/login");
        toast.error("Please login to upload videos");
        return;
      }
      if (user?.channel?._id) {
        navigate(`/channel/${user.channel.handle}`);
        return;
      }
      navigate("/upload/create");
      toast.error("Create a channel to upload videos");
      return;
    }
    navigate(`/${item.toLowerCase()}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 text-white flex flex-col items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-2.5 right-5 p-2 hover:bg-white/10 rounded-full transition cursor-pointer">
        <X size={40} />
      </button>

      <div className="flex flex-col w-full items-center">
        {navItems.map((item, index) => (
          <div key={index}
            onClick={() => handleNavigation(item)}
            className="w-full text-center py-6 cursor-pointer transition-colors duration-300 hover:bg-zinc-800">
            <h1 className="text-6xl md:text-7xl font-bold">{item}</h1>
          </div>
        ))}

        {isAuthenticated && (
          <div onClick={handleLogout}
            className="w-full text-center py-6 cursor-pointer transition-colors duration-300 hover:bg-red-600/20 text-red-500 flex items-center justify-center gap-3">
            <LogOut size={40} />
            <h1 className="text-5xl md:text-6xl font-bold">Logout</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
