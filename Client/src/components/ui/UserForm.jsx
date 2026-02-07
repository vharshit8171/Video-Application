import React from 'react'
import { useEffect, useState } from "react";
import { Camera, Mail, Lock, User, MapPin, Phone } from "lucide-react";

const UserForm = ({ mode = "signup", formData, setFormData, onSubmit, isLoading, }) => {
    const [preview, setPreview] = useState(
        formData.avatar && typeof formData.avatar === "string"
            ? formData.avatar : null);

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

    useEffect(() => {
        return () => {
            if (preview && typeof preview !== "string") {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    return (
        <>
            <div className="flex justify-center mb-3 md:mb-5 xl:mb-4">
                <label htmlFor="profile"
                    className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 xl:w-24 xl:h-24 rounded-full overflow-hidden border-2 border-zinc-800 flex items-center justify-center cursor-pointer">
                    {preview ? (
                        <img src={preview} alt="Preview" className="object-cover w-full h-full" />) : (
                        <User className="w-10 h-10 md:w-14 md:h-14 xl:w-10 xl:h-10 text-gray-400" />)}
                    <div className="absolute bottom-0 right-0 bg-zinc-800 p-1.5 rounded-full">
                        <Camera className="w-4 h-4 md:w-8 md:h-8 xl:w-4 xl:h-4 text-white" />
                    </div>
                    <input type="file"
                        name="avatar"
                        id="profile"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}/>
                </label>
            </div>

            <form className="space-y-4 p-0.5" onSubmit={onSubmit}>
                <div className="relative">
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
                    <input type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Full Name"
                        className="w-full pl-10 pr-2 py-2 md:py-4 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"/>
                </div>

                <div className="relative">
                    <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Email Address"
                        className="w-full pl-10 pr-2 py-2 md:py-4 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"/>
                </div>

                {mode === "signup" && (
                    <div className="relative">
                        <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Password"
                            className="w-full pl-10 pr-2 py-2 md:py-4 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"/>
                    </div>
                )}

                <div className="relative">
                    <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Address"
                        className="w-full pl-10 pr-2 py-2 md:py-4 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"/>
                </div>

                <div className="relative">
                    <Phone className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:w-12 md:h-10 xl:w-6 xl:h-6" />
                    <input
                        type="number"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={handleChange}
                        required
                        placeholder="Contact Number"
                        className="w-full pl-10 pr-2 py-2 md:py-4 md:pl-18 md:text-2xl xl:py-2 xl:text-lg xl:pl-14 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"/>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 md:py-4 md:mt-4 md:text-2xl sm:py-3 xl:text-xl rounded-xs font-semibold text-xl transition cursor-pointer 
              ${isLoading ? "bg-zinc-600 text-gray-300 cursor-not-allowed" : "bg-gray-300 hover:bg-zinc-400 text-black"}`}>
                    {isLoading ? mode === "signup"
                        ? "Creating Account..."
                        : "Updating Profile..."
                        : mode === "signup"
                            ? "Sign Up"
                            : "Save Changes"}
                </button>
            </form>
        </>
    )
}

export default UserForm