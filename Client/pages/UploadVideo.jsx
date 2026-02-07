import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {useChannelStore} from "../store/channelStore.js";
import { useVideoStore } from "../store/videoStore.js";
import VideoForm from "../src/components/ui/VideoForm.jsx";

const VideoUpload = () => {
    const navigate = useNavigate();
    const channel = useChannelStore((state) => state.channel); 
    const uploadVideo = useVideoStore((state) => state.uploadVideo);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        duration: "",
        isPublished: false,
        videoClip: null,
        thumbnail: null,
    });
    const [isPublishing, setisPublishing] = useState(false);

    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, isPublished: checked }));
            return;
        }
        if (files && files[0]) {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.videoClip) return toast.error("Please upload a video!");
        if (!formData.thumbnail) return toast.error("Please upload a thumbnail!");

        try {
            setisPublishing(true);
            await uploadVideo(channel.handle,formData);
            toast.success("Video uploaded successfully!");
            setFormData({
                title: "",
                description: "",
                category: "",
                duration: "",
                isPublished: false,
                videoClip: null,
                thumbnail: null
            });
            navigate("/home");
        } catch (error) {
            console.error(error);
            toast.error("Upload failed!");
        } finally {
            setisPublishing(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center px-4 pt-24 bg-black">
            <div className="w-full max-w-7xl bg-zinc-900 rounded-xs shadow-lg px-8 py-5">
                <div className="mb-2 border-b-2 border-zinc-800">
                    <h2 className="text-white text-2xl sm:text-3xl font-semibold mb-2.5">
                        Upload New Video File
                    </h2>
                    <p className="mb-2 text-md xl:text-lg">Upload your video file and other media here.</p>
                </div>
                <VideoForm mode="upload" formData={formData} handleChange={handleChange}  handleSubmit={handleSubmit} isPublishing={isPublishing} btnText={"Upload & Publish Video"} btnLoadingText={"Uploading..."} />
            </div>
        </div>
    );

};

export default VideoUpload;
