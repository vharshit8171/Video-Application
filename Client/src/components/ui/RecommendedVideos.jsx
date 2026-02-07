import React, { useEffect } from "react";
import PageLoader from "./PageLoader";
import VideoCard from "./VideoCard";
import {useVideoStore} from "../../../store/videoStore.js"

const RecommendedVideos = ({videoId}) => {
  const isrecommendedLoading = useVideoStore((state) => state.isLoading);
  const error = useVideoStore((state) => state.error);
  const recommendedVideos = useVideoStore((state) => state.recommendedVideos);
  const getRecommendedVideos = useVideoStore((state) => state.getRecommendedVideos);
  
  useEffect(() => {
     getRecommendedVideos(videoId);
  }, [getRecommendedVideos,videoId]);

  if (isrecommendedLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="text-white"><PageLoader /></div>
      </div>
    );}

  if (error) {
    return (
      <div className="flex items-center justify-center py-10 text-red-500">
        {error}
      </div>
    );}
  return (
    <div className="flex gap-1 lg:gap-2.5 p-1 overflow-x-auto pb-2 scrollbar-hide">
      {recommendedVideos.map((video) => (
        <VideoCard video={video} key={video._id} />
      ))}
    </div>
  );
};

export default RecommendedVideos;
