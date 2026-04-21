const VideoSkeleton = () => {
  return (
    <div className="animate-pulse w-full max-w-[350px]">
      <div className="bg-zinc-700 h-55 w-full rounded-md"></div>

      <div className="flex gap-3 mt-3">
        <div className="bg-zinc-700 h-10 w-10 rounded-full"></div>

        <div className="flex-1">
          <div className="bg-zinc-700 h-3 w-3/4 rounded mb-2"></div>
          <div className="bg-zinc-700 h-3 w-1/2 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoSkeleton;