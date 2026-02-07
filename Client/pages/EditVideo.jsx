import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import VideoForm from "../src/components/ui/VideoForm"
import { useAuthStore } from "../store/authStore.js";
import { useVideoStore } from "../store/videoStore.js";
import { useChannelStore } from "../store/channelStore.js";

const EditVideo = () => {
    const user = useAuthStore((state) => state.user);
    const editVideo = useVideoStore((state) => state.
        editVideo);
    const channel = useChannelStore((state) => state.channel);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        isPublished: false,
        thumbnail: null,
    });
    const navigate = useNavigate();
    const { videoId } = useParams();
    const [isPublishing, setisPublishing] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            const res = await axios.get(`http://localhost:5000/api/v1/video/getVideo/${videoId}`, { withCredentials: true });
            setFormData({
                title: res.data.data.title,
                description: res.data.data.description,
                category: res.data.data.category,
                isPublished: res.data.data.isPublished,
                thumbnail: res.data.data.thumbnail
            })
        }
        fetchVideo();
    }, [videoId])

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
        try {
            setisPublishing(true);
            await editVideo(formData, videoId, channel.handle);
            toast.success("Video edit successfully!");
            setFormData({
                title: "",
                description: "",
                category: "",
                isPublished: false,
                thumbnail: null
            });
            navigate(`/channel/${user.channel?.handle}`);
        } catch (error) {
            console.error(error);
            toast.error("Upload failed!");
        } finally {
            setisPublishing(false);
        }
    };

    return (
        <div className="h-screen flex justify-center px-4 pt-28 bg-black">
            <div className="w-full h-[80vh] max-w-7xl bg-zinc-900 rounded-xs shadow-lg px-8 py-5">
                <div className="mb-2 border-b-2 border-zinc-800">
                    <h2 className="text-white text-3xl font-semibold mb-2.5">
                        Edit Your Video File
                    </h2>
                </div>
                <VideoForm mode="edit" formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isPublishing={isPublishing} btnText={"Edit & Publish Video"} btnLoadingText={"Editing..."} />
            </div>
        </div>
    )
}

export default EditVideo