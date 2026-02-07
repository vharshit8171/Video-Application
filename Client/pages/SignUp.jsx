import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserForm from "../src/components/ui/UserForm.jsx";
import { useAuthStore } from "../store/authStore.js";

const Signup = () => {
  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [formData, setFormData] = useState({
    avatar: null,
    username: "",
    email: "",
    password: "",
    contact_number: "",
    location: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Registered Successfully! Welcome");
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!error) return;
    toast.error(error || "Something went wrong");
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    register(formData);
  };

  return (
    <div className="flex items-start justify-center px-4 pt-35 xl:pt-26 xl:px-2 md:pt-54">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-xl xl:max-w-md bg-zinc-900 rounded-sm shadow-lg p-4 sm:p-8 md:px-8 md:py-4 max-h-[85vh] flex flex-col justify-start ">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl xl:text-3xl font-semibold text-center mb-3 md:mb-4 xl:mb-2">
          Create Your Account
        </h2>

        <UserForm mode="signup"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isLoading={isLoading} />

        <p className="text-center text-gray-400 text-[1.1rem] md:text-2xl xl:text-xl font-semibold mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-zinc-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
