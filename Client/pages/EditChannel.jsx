import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserRoundPen } from "lucide-react";
import { useAuthStore } from '../store/authStore.js';
import { useChannelStore } from '../store/channelStore.js';
import ConfirmAction from "../src/components/ui/ConfirmAction.jsx";
import ChanneLForm from '../src/components/ui/ChannelForm.jsx';
import toast from 'react-hot-toast';

const EditChannel = () => {
  const Navigate = useNavigate();
  const [openDeleteConfirm, setopenDeleteConfirm] = useState(false)
  const channel = useChannelStore((state) => state.channel);
  const editChannel = useChannelStore((state) => state.editChannel);
  const deleteChannel = useChannelStore((state) => state.deleteChannel);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [formData, setFormData] = React.useState({
    name: channel?.name || "",
    description: channel?.description || "",
    category: channel?.category || "",
    website: channel?.website || "",
    handle: channel?.handle || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editChannel(formData);
      toast.success("Channel updated successfully!!!");
      Navigate(`/channel/${formData.handle}`);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  }

  const handleDelete = async () => {
    try {
      await deleteChannel(channel.handle);
      toast.success("Channel Deleted!!!");
      Navigate("/home");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <div className="relative z-70 w-screen min-h-screen bg-black flex items-start md:items-center justify-center px-3 sm:px-6 lg:px-10 py-6 sm:py-4">
      <div className="w-full max-w-7xl bg-zinc-900 rounded-sm shadow-lg p-6 md:p-6 max-h-screen overflow-y-auto">

        <div className='w-full flex justify-between items-center px-0.5 mb-4'>
          <h2 className="text-white text-xl sm:text-3xl font-semibold text-center">
            Edit Channel
          </h2>
          <button onClick={() => setopenDeleteConfirm(true)}
            className='text-md cursor-pointer font-semibold px-4 py-3 bg-red-600 hover:bg-red-500 rounded-xs'>Delete Channel</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          <ChanneLForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} isLoading={isLoading} Icon={<UserRoundPen />} iconSize={58} btnText={"Edit Channel"} btnLoadindText={"Editing"} />
        </div>

        {openDeleteConfirm && (
          <ConfirmAction
            title='Confirm Channel Deletion'
            description=" Are you absolutely sure you want to delete your channel?"
            setOpenConfirm={setopenDeleteConfirm}
            confirmText='Delete Channel'
            onConfirm={handleDelete}
          />)}
      </div>
    </div>
  )
}

export default EditChannel