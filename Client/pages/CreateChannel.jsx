import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useChannelStore } from "../store/channelStore";
import ChannelForm from "../src/components/ui/ChannelForm.jsx";
import { Image } from "lucide-react";
const CreateChannel = () => {
  const navigate = useNavigate();
  const createChannel = useChannelStore((state) => state.createChannel);
  const isChannelCreated = useChannelStore((state) => state.isChannelCreated);
  const isLoading = useChannelStore((state) => state.isLoading);
  const error = useChannelStore((state) => state.error);
  const resetChannel = useChannelStore((state) => state.resetChannel);
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    description: "",
    category: "",
    website: "",
    logo: null,
    banner: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo" || name === "banner") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    if (!isChannelCreated) return;

    toast.success("Channel created successfully!!!");
    navigate(`/channel/${formData.handle}`);
    resetChannel();
  }, [isChannelCreated, formData.handle, navigate, resetChannel]);

  useEffect(() => {
    if (!error) return;
    toast.error(error || "Something went wrong");
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.handle || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }
    await createChannel(formData);
  };

  return (
    <div className="relative z-70 w-screen min-h-screen bg-black flex items-start md:items-center justify-center px-3 sm:px-6 lg:px-10 py-6 sm:py-4">
      <div className="w-full max-w-7xl bg-zinc-900 rounded-sm shadow-lg p-6 md:p-6 max-h-screen overflow-y-auto">

        <h2 className="text-white text-xl sm:text-3xl font-semibold text-center mb-4">
          Create Your Channel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          <ChannelForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isLoading={isLoading} Icon={<Image />} iconSize={58} btnText={"Create Channel"} btnLoadingText={"Creating..."} />
        </div>
      </div>
    </div>
  );
};

export default CreateChannel;
