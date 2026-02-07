import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVideoStore } from "../../../store/videoStore.js";
import PageLoader from "./PageLoader.jsx";

const WatchVideo = () => {
  const { videoId } = useParams();

  const isLoading = useVideoStore((state) => state.isLoading);
  const currentVideo = useVideoStore((state) => state.currentVideo);
  const getVideoById = useVideoStore((state) => state.getVideoById);

  useEffect(() => {
    if (!currentVideo || currentVideo._id !== videoId) {
      getVideoById(videoId);
    }
  }, [videoId, currentVideo, getVideoById]);

  if (isLoading || !currentVideo) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-2.5">
      <div className="w-full max-w-[90vw] max-h-[95vh] aspect-video bg-black 
          flex items-center justify-center">
        <video src={currentVideo.videoClip}
          controls
          autoPlay
          controlsList="nodownload"
          playsInline
          className="w-full h-full object-contain bg-black" />
      </div>
    </div>
  );
};

export default WatchVideo;
