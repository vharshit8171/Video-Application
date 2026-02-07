import React, { useEffect } from 'react'
import { useVideoStore } from "../../../store/videoStore.js";
import { useSearchParams } from 'react-router-dom';
import VideoCard from './VideoCard.jsx';

const SearchResult = () => {
    const [queryParam] = useSearchParams();
    const query = queryParam.get("q");

    const isLoading = useVideoStore((state) => state.isLoading);
    const searchedVideos = useVideoStore((state) => state.searchedVideos);
    const getSearchVideos = useVideoStore((state) => state.getSearchVideos);

    useEffect(() => {
        if (!query || query.trim().length < 2) return;
        getSearchVideos(query);
    }, [query, getSearchVideos]);

    if (isLoading) {
        return <p className="mt-24 text-center text-white">Loading...</p>;
    }

    return (
        <div className="pt-24 px-2 sm:px-4 text-white">
            <h2 className="text-2xl text-center ml-8 my-4">
                Results for "{query}":
            </h2>

            <div className="w-full min-h-[65vh] sm:min-h-[74vh] flex flex-wrap gap-2 mt-8 sm:gap-3 items-start">

                {searchedVideos.length === 0 && (
                    <p className="text-xl font-semibold w-full text-center mt-10">
                        No video found.
                    </p>)}
                {searchedVideos.map((video, indx) => (
                    <VideoCard key={video._id} video={video} indx={indx} />
                ))}

            </div>
        </div>
    );
};


export default SearchResult