import { useState } from "react";
import { Video, Image, CloudUpload, CheckCircle } from "lucide-react";

const VideoForm = ({ mode = "upload", formData, handleChange, handleSubmit, isPublishing, btnText, btnLoadingText }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    return (
        <>
            <form onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-8" >
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter video title"
                            className="w-full px-3 py-2 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your video"
                            rows={4}
                            className="w-full px-3 py-2 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Education, Tech, Vlog..."
                            className="w-full px-3 py-2 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"
                            required
                        />
                    </div>
                    {mode === "upload" && (
                        <div>
                            <label className="block text-gray-300 mb-1">Duration (minutes)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g. 12"
                                className="w-full px-3 py-2 bg-zinc-800 text-white rounded-xs focus:ring-2 focus:ring-zinc-700 outline-none"
                                required
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-3 mt-4">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <div>
                            <p className="text-gray-200">Publish immediately</p>
                            <p className="text-xs text-gray-400">
                                Video will be visible to everyone
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {mode === "upload" && (
                        <>
                            <label className="block text-gray-300 mb-2">
                                Upload Video
                            </label>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    name="videoClip"
                                    accept="video/*"
                                    onChange={(e) => {
                                        handleChange(e);
                                        setVideoFile(e.target.files[0])
                                    }}
                                    className="hidden"
                                    required={mode  === "upload"} />
                                <div className={`border-2 border-dashed ${videoFile ?"border-green-700" :"border-zinc-700" } rounded-md p-10  flex flex-col items-center justify-center text-center hover:border-zinc-500 transition`}>
                                    <Video className="w-10 h-10 text-gray-400 mb-3" />
                                    <p className="text-white font-medium">
                                        Click to upload video
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        MP4, MKV, WEBM supported
                                    </p>
                                </div>
                            </label>
                            {videoFile && (
                                <div className="flex justify-start items-center mt-1 gap-2">
                                    <p className="text-md text-gray-600">
                                        Video Selected
                                    </p>
                                    <span><CheckCircle className="text-green-500 w-4 h-4" /></span>
                                </div>
                            )}
                        </>
                    )}

                    <label className="block text-gray-300 mb-2 mt-3">
                        Upload Thumbnail
                    </label>

                    <label className="cursor-pointer">
                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            onChange={(e) => {
                                handleChange(e);
                                setThumbnailFile(e.target.files[0]);
                            }}
                            className="hidden"
                            required = {mode === "upload"} />

                        <div className={`border-2 border-dashed ${thumbnailFile ? "border-green-700" : "border-zinc-700"} rounded-md p-8 flex flex-col items-center justify-center text-center hover:border-zinc-500 transition`}>
                            <Image className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-white font-medium">
                                Upload thumbnail
                            </p>
                            <p className="text-xs text-gray-400">
                                16:9 recommended
                            </p>
                        </div>
                    </label>
                    {thumbnailFile && (
                        <div className="flex justify-start items-center mt-1 gap-2">
                            <p className="text-md text-gray-600">
                                Thumbnail Selected
                            </p>
                            <span><CheckCircle className="text-green-500 w-4 h-4" /></span>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={isPublishing}
                        className={`w-full py-3 text-lg cursor-pointer font-semibold rounded-xs transition hover:bg-zinc-500
                            ${isPublishing
                                ? "bg-zinc-700 text-gray-300 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300 text-black"
                            }`}>
                        <CloudUpload size={28} className="mr-1.5 inline" />
                        {isPublishing ? btnLoadingText : btnText}
                    </button>
                </div>
            </form>
        </>
    )
}

export default VideoForm