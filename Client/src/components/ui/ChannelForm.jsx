import React from 'react'
import { User, FileText, Link as LinkIcon, Tag, AtSign, } from "lucide-react";

const ChannelForm = ({ formData, handleChange, handleSubmit, isLoading, Icon, iconSize, btnText, btnLoadingText }) => {
    return (
        <>
        <form className="space-y-2" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-300 text-sm mb-1">
                        Channel Name *
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter channel name"
                            className="w-full pl-11 py-2 focus:ring-2 focus:ring-zinc-700 outline-none bg-zinc-800 text-white rounded-xs"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm mb-1">
                        Channel Handle *
                    </label>
                    <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            name="handle"
                            value={formData.handle}
                            onChange={handleChange}
                            placeholder="unique-handle"
                            className="w-full pl-11 py-2  bg-zinc-800 text-white rounded-xs  focus:ring-2 focus:ring-zinc-700 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm mb-1">
                        Short Description *
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="What is your channel about?"
                            className="w-full pl-11 py-2 bg-zinc-800 text-white rounded-xs resize-none focus:ring-2 focus:ring-zinc-700 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm mb-1">
                        Category
                    </label>
                    <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full pl-11 py-2 bg-zinc-800 text-white rounded-xs  focus:ring-2 focus:ring-zinc-700 outline-none">
                            <option value="">Select category</option>
                            <option value="Education">Education</option>
                            <option value="Technology">Technology</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Music">Music</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm mb-1">
                        Website / Social Link <span>(Optional)</span>
                    </label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://"
                            className="w-full pl-11 py-2 bg-zinc-800 text-white rounded-xs  focus:ring-2 focus:ring-zinc-700 outline-none"/>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-300 text-sm mb-1">
                        Channel Logo
                    </label>
                    <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 text-gray-300 rounded-xs
                file:bg-zinc-700 file:border-none file:text-white file:px-3 file:py-1"
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm mb-1">
                        Banner Image <span>(Optional)</span>
                    </label>
                    <input
                        type="file"
                        name="banner"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full bg-zinc-800 text-gray-300 rounded-xs
                file:bg-zinc-700 file:border-none file:text-white file:px-3 file:py-1"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 text-lg cursor-pointer font-semibold rounded-xs transition
                ${isLoading
                            ? "bg-zinc-600 text-gray-300 cursor-not-allowed"
                            : "bg-gray-300 hover:bg-zinc-400 text-black"
                        }`}>
                    {isLoading ? btnLoadingText : btnText}
                </button>
            </form>

            <div className="hidden md:flex items-center justify-center bg-zinc-800 rounded-sm">
                <div className="text-center px-6">
                    <div className="mx-auto w-20 h-16 text-gray-400">
                        {Icon && React.cloneElement(Icon, { size: iconSize || 80 })}
                    </div>
                    <h3 className="text-white text-xl font-semibold ml-[-1rem] ">
                        Build Your Identity
                    </h3>
                    <p className="text-gray-400 text-sm">
                        Upload a logo and banner to make your channel stand out and
                        attract viewers.
                    </p>
                </div>
            </div>
        </>
    )
}

export default ChannelForm