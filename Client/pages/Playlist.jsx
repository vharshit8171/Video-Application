import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { usePlaylistStore } from "../store/PlaylistStore.js";
import PageLoader from "../src/components/ui/PageLoader.jsx";
import CreatePlaylistModel from "../src/components/ui/CreatePlaylistModal.jsx";

const Playlists = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  
  const playlists = usePlaylistStore((state) => state.playlists);
  const isLoading = usePlaylistStore((state) => state.isLoading);
  const fetchUserPlaylist = usePlaylistStore((state) => state.fetchUserPlaylist);

  useEffect(() => {
    if(playlists.length === 0){fetchUserPlaylist();}
  }, [playlists,fetchUserPlaylist]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen text-white pt-16">
      <h1 className="text-3xl font-semibold px-14 mt-8">
          Your Playlists
        </h1>
      <div className="max-w-7xl mx-auto px-1 mt-[1rem]">
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-self-start px-4 py-6 text-center opacity-80">
            <p className="text-lg mb-4">
              You haven’t created any playlists yet
            </p>
            <button
              onClick={() => setOpenCreateModal(true)}
              className="flex flex-col items-center gap-3.5 cursor-pointer px-5 py-16 border border-dashed border-white/40 rounded-xs hover:bg-white/10 transition">
              <Plus size={28} />
              <p className="text-md font-semibold">Create your first playlist</p>
            </button>
          </div>
        ) : (
          <div className="grid px-2 py-1 gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <div key={playlist._id}
                onClick={()=>{navigate(`/playlist/${playlist._id}`)}}
                className="group cursor-pointer">
                <div className="relative aspect-video rounded-sm overflow-hidden bg-gray-800">
                  <img src={playlist?.videos[0]?.thumbnail || "https://images.unsplash.com/photo-1555066931-4365d14bab8c"}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"/>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <span className="text-sm font-medium">
                      View Playlist
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <h3 className="text-md font-medium truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-xs opacity-70">
                    {playlist.videos?.length || 0} videos
                  </p>
                </div>
              </div>
            ))}

            <button onClick={() => setOpenCreateModal(true)}
              className="flex flex-col items-center justify-center aspect-video rounded-sm border border-dashed border-white/30 hover:border-white/60 hover:bg-white/5 transition cursor-pointer">
              <Plus size={36} />
              <span className="mt-2 text-md opacity-80">
                Create Playlist
              </span>
            </button>
          </div>
        )}
      </div>

      <CreatePlaylistModel
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
      />
    </div>
  );
};

export default Playlists;
