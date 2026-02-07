import { useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore.js'

const VideoCard = ({ video, onDeleteRequest, variant = "grid" }) => {
  const navigate = useNavigate()
  const [openMenu, setOpenMenu] = useState(false)

  const user = useAuthStore((state) => state.user)
  const isOwner = String(video?.owner) === String(user?._id)

  const sizeClasses = variant === "compact"
    ? `min-w-[180px] sm:min-w-[240px] h-[100px] sm:h-[150px]
      ` : `w-full h-[140px] sm:h-[170px] md:h-[190px] lg:w-[32vw] lg:h-[24vh] xl:w-[24.2vw] xl:h-[36vh]`;

  return (
    <div
      onClick={() => navigate(`/video/${video._id}`)}
      className={`relative group cursor-pointer overflow-hidden rounded-xs transition-all duration-300 ease-in-out hover:scale-[1.03] ${sizeClasses}`}>

      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover" />

      <div className="absolute bottom-0 left-0 w-full bg-black/70 p-2 sm:p-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-sm sm:text-lg md:text-xl text-center line-clamp-1">
          {video.title}
        </h2>
        <p className="text-[11px] sm:text-sm md:text-base text-center line-clamp-2">
          {video.description}
        </p>
      </div>

      {isOwner && (
        <div className="absolute top-2 right-2 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpenMenu(prev => !prev)
            }}
            className="p-1 rounded-full bg-black/50 hover:bg-black/70" >
            <MoreVertical size={18} />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-28 bg-zinc-800 border border-zinc-700 rounded-xs shadow-lg z-50">
              <button onClick={(e) => {
                e.stopPropagation()
                setOpenMenu(false)
                navigate(`/video/${video._id}/edit`)
              }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-700">
                Edit
              </button>
              <button onClick={(e) => {
                e.stopPropagation()
                setOpenMenu(false)
                onDeleteRequest(video)
              }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-700">
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default VideoCard
