import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, User, Mail, MapPin, Phone } from "lucide-react";
import { useAuthStore } from "../../../store/authStore.js";

const EditProfile = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const profileUpdated = useAuthStore((state) => state.profileUpdated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const resetProfileUpdated = useAuthStore((state) => state.resetProfileUpdated);
  const [preview, setPreview] = useState(user.avatar || null);

  const [formData, setFormData] = useState({
    avatar: user.avatar,
    username: user.username,
    email: user.email,
    contact_number: user.contact_number,
    location: user.location,
  });

  useEffect(() => {
    if (profileUpdated) {
      toast.success("Profile updated successfully!");
      resetProfileUpdated();
      navigate("/profile");
    }
  }, [profileUpdated, resetProfileUpdated, navigate]);

  useEffect(() => {
    if (!error) return;
    toast.error(error || "Something went wrong");
  }, [error]);

  useEffect(() => {
    return () => {
      if (preview && typeof preview !== "string") {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="flex justify-center px-4 pt-35 xl:pt-26 md:pt-54">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-xl xl:max-w-6xl bg-zinc-900 rounded-xs shadow-lg p-4 md:px-8 flex flex-col gap-2">
        <div className="text-center">
          <h2 className="text-zinc-300 text-2xl sm:text-3xl md:text-4xl xl:text-4xl font-semibold mb-0.5">
            Update Profile
          </h2>
          <p className="text-zinc-300 text-md">
            Manage your personal information
          </p>
        </div>

        <div className="bg-zinc-800 rounded-xs px-4 py-2 sm:px-5 
        sm:py-3 flex flex-col items-center gap-1">
          <label
            htmlFor="avatar"
            className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer flex items-center justify-center">
            {preview ? (
              <img src={preview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-zinc-500" />
            )}

            <div className="absolute bottom-1 right-1 bg-zinc-700 p-1.5 rounded-full">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleChange} />
          </label>

          <div className="text-center">
            <h3 className="text-3xl font-medium text-zinc-300">
              {formData.username}
            </h3>
            <p className="text-zinc-300 text-md">
              {formData.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-zinc-800 rounded-xs p-4 sm:p-5 space-y-2"
        >
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 font-semibold text-zinc-500" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-14 pr-3 py-2 bg-zinc-900 text-zinc-300 rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none" />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full pl-14 pr-3 py-2 bg-zinc-900 text-zinc-300 rounded-xs cursor-not-allowed  focus:ring-2 focus:ring-zinc-700 outline-none" />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="w-full pl-14 pr-3 py-2 bg-zinc-900 text-zinc-300 rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none" />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="w-full pl-14 pr-3 py-2 bg-zinc-900 text-zinc-300 rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 mt-2 font-semibold rounded-xs transition cursor-pointer
            ${isLoading
                ? "bg-zinc-400 text-zinc-600 cursor-not-allowed"
                : "bg-zinc-500 hover:bg-zinc-400 text-black"
              }`}>
            {isLoading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );

};

export default EditProfile;
