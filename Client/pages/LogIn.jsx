import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, User } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";

const LogIn = () => {
  const navigate = useNavigate();

  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [loginData, setloginData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setloginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login Successful !!! Welcome Back");
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!error) return;
    toast.error(error || "Invalid credentials");
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(loginData);
  };

  return (
    <div className="flex items-center justify-center pt-34 xl:pt-30 xl:px-2 md:pt-58">
      <div className="w-full max-w-xs px-5 sm:max-w-sm md:max-w-xl xl:max-w-md bg-zinc-900 rounded-sm shadow-lg sm:p-8 md:px-8 md:py-7 xl:py-3 max-h-[85vh] flex flex-col justify-center">
        
        <h2 className="text-white text-xl sm:text-4xl font-semibold text-center mb-3 xl:mb-0 py-3">
          Login Your Account
        </h2>

        <div className="flex justify-center mb-7 xl:mb-4">
          <div className="w-28 h-22 sm:w-30 sm:h-30 md:w-54 md:h-35 flex items-center justify-center">
            <img
              className="w-38 h-32 sm:w-30 sm:h-30 md:w-50 md:h-52 xl:w-54 xl:h-50"
              src="../src/assets/Login.png"
              alt="App Logo"/>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
            <input
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full pl-10 pr-2 py-2 md:py-4 md:mb-3 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 xl:mb-1 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full pl-10 pr-2 py-2 md:py-4 md:mb-3 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 xl:mb-1 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full pl-10 pr-2 py-2 md:py-4 md:mb-1 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 xl:mb-0 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 sm:py-3 md:py-4 md:mt-4 md:text-2xl xl:text-xl cursor-pointer rounded-xs font-semibold text-xl transition 
              ${isLoading ? "bg-zinc-600 text-gray-300 cursor-not-allowed" : "bg-gray-300 hover:bg-zinc-400 text-black"}`}>
            {isLoading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-[0.98rem] sm:text-[1.3rem] font-semibold my-3 xl:my-1.5">
          Don&apos;t have an account?{" "}
          <Link to="/signup">
            <span className="text-zinc-600 hover:underline">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
