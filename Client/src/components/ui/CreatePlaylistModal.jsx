import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import PageLoader from "./PageLoader.jsx";
import { usePlaylistStore } from "../../../store/PlaylistStore.js";

const CreatePlaylistModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const createPlaylist = usePlaylistStore((state) => state.createPlaylist);
  const isLoading = usePlaylistStore((state) => state.isLoading);

  if (!isOpen) return null;

  if (isLoading) {
    return <PageLoader />
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const success = await createPlaylist({ name, description });

    if (success) {
      onClose();
      toast.success("Playlist created successfully!!!");
      setName("");
      setDescription("");
      onClose();
    }else{
      toast.error("Something went wrong!!!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/85"
        onClick={onClose} />

      <div className="relative w-full max-w-lg bg-zinc-900 rounded-sm p-6 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">
            Create Playlist
          </h2>
          <button onClick={onClose}>
            <X size={38} className="opacity-70 cursor-pointer p-2 hover:bg-white/70 rounded-full" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-md mb-1.5">
              Playlist name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My favorite videos"
              className="w-full bg-zinc-800 border border-white/10 rounded-xs cursor-pointer px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/20" />
          </div>

          <div>
            <label className="block text-md mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Some description..."
              className="w-full bg-zinc-800 border border-white/10 rounded-xs px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/20" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button"
              onClick={onClose}
              className="px-4 py-2 text-md rounded-xs cursor-pointer font-semibold hover:bg-white/10 transition">
              Cancel
            </button>

            <button type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-md rounded-xs bg-white text-black cursor-pointer font-semibold disabled:opacity-50">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
