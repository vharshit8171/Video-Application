import { useEffect, useState } from "react";
import PageLoader from "../src/components/ui/PageLoader.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useVideoStore } from "../store/videoStore.js";
import VideoCard from "../src/components/ui/VideoCard.jsx";

const Home = () => {
  const [currentPage, setcurrentPage] = useState(1);
  const videosPerPage = 8;

  const homeVideos = useVideoStore((state) => state.homeVideos);
  const totalPages = useVideoStore((state) => state.totalPages);
  const isLoading = useVideoStore((state) => state.isLoading);
  const fetchHomeVideos = useVideoStore((state) => state.fetchHomeVideos);

  const numberOfPagesarr = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    fetchHomeVideos(currentPage, videosPerPage);
  }, [fetchHomeVideos, currentPage]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col items-center pt-[1vw] text-white text-base md:text-xl font-semibold">

      <div className="w-[75vw] sm:w-[50vw] mt-[4.5rem] sm:mt-[6rem] md:mt-[6.5rem] xl:mt-[5rem] text-center p-1 my-4">
        <button
          onClick={() => currentPage > 1 && setcurrentPage(p => p - 1)}
          disabled={currentPage === 1}
          className="border border-zinc-700 rounded-xs mr-3 px-2 py-2 hover:bg-zinc-700/80">
          <ArrowLeft size={22} />
        </button>

        {numberOfPagesarr.map((page) => {
          const isActive = currentPage === page;
          return (
            <span key={page}
              onClick={() => setcurrentPage(page)}
              className={`border border-zinc-700 rounded-xs mr-3 px-2 py-1.5 cursor-pointer
                ${isActive ? "bg-zinc-300 text-black" : "hover:bg-zinc-700/80"}`}>
              {page}
            </span>
          );
        })}

        <button
          onClick={() => currentPage < totalPages && setcurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
          className="border border-zinc-700 rounded-xs px-2 py-2 hover:bg-zinc-700/80">
          <ArrowRight size={22} />
        </button>
      </div>

      <div className="w-full px-2 sm:px-4 ">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center lg:gap-1">
          {homeVideos.map((video, indx) => (
            <VideoCard key={video._id} video={video} indx={indx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
