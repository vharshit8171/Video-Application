import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { usePlaylistStore } from "../../../store/PlaylistStore.js";

const SaveVideoModal = ({ isOpen, onClose, videoId, videoTitle, }) => {
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const playlists = usePlaylistStore((state) => state.playlists);
    const addVideoToPlaylists = usePlaylistStore((state) => state.addVideoToPlaylists);

    if (!isOpen) return null;

    const togglePlaylist = (playlistId) => {
        setSelectedPlaylists((prev) =>
            prev.includes(playlistId)
                ? prev.filter((id) => id !== playlistId)
                : [...prev, playlistId]
        );
    };

    const handleSave = async() => {
        if (selectedPlaylists.length === 0) return;

        await addVideoToPlaylists(videoId,selectedPlaylists);
        toast.success("Video added successfully!!!");
        onClose();
    };

    return (
        <div className="h-screen fixed inset-0 z-50 flex items-center justify-center bg-black/75">
            <div className="w-full max-w-[26vw] bg-[#111] text-white rounded-xs overflow-hidden">

                <div className="flex flex-col items-center justify-between px-2.5 py-3">
                    <div className="w-full px-1.5 flex justify-between items-center">
                        <h2 className="text-2xl font-semibold">Save to playlist</h2>
                        <button className="cursor-pointer hover:bg-slate-600 rounded-full p-1.5" onClick={onClose}>
                            <X size={22} />
                        </button>
                    </div>
                    <div className="h-px w-[98%] mx-auto mt-0.5 bg-gradient-to-r from-transparent via-white/45 to-transparent"/>
                </div>

                <div className="px-4 mb-2.5">
                    <p className="text-sm font-medium truncate">
                       Video: {videoTitle}
                    </p>
                </div>

                <div className="px-4 py-3 space-y-3 max-h-70 overflow-y-auto">
                    {playlists.map((playlist) => (
                        <div key={playlist._id}
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => togglePlaylist(playlist._id)}>
                            <input type="checkbox"
                                checked={selectedPlaylists.includes(playlist._id)}
                                readOnly
                                className="accent-red-600" />
                            <span className="text-md">{playlist.name}</span>
                        </div>
                    ))}
                    {playlists.length === 0 && (
                        <p className="text-sm opacity-70">
                            No playlists found
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3.5 px-4 py-3">
                    <button onClick={onClose}
                        className="px-4 py-2 text-md font-semibold hover:bg-white/10 rounded-xs cursor-pointer">
                        Cancel
                    </button>

                    <button onClick={handleSave}
                        disabled={selectedPlaylists.length === 0}
                        className="px-4 py-2 text-md cursor-pointer font-semibold bg-red-600 disabled:opacity-40 rounded-xs">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveVideoModal;
