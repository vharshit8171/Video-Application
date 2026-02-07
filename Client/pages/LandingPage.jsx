import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore.js"
import { ArrowBigRight } from "lucide-react"
import WrapButton from "@/components/ui/wrap-button"
import Navbar from "../src/components/ui/Navbar.jsx"
import LogoLoop from "../src/components/components/LogoLoop.jsx"
import {SiYoutube, SiTwitch, SiNetflix, SiAmazonprime, SiVimeo,
SiSpotify, SiDiscord, SiObsstudio} from "react-icons/si";


const streamingLogos = [
  { node: <SiYoutube />, title: "YouTube", href: "https://youtube.com" },
  { node: <SiTwitch />, title: "Twitch", href: "https://twitch.tv" },
  { node: <SiNetflix />, title: "Netflix", href: "https://netflix.com" },
  { node: <SiAmazonprime />, title: "Prime Video", href: "https://primevideo.com" },
  { node: <SiVimeo />, title: "Vimeo", href: "https://vimeo.com" },
  { node: <SiSpotify />, title: "Spotify", href: "https://spotify.com" },
  { node: <SiDiscord />, title: "Discord", href: "https://discord.com" },
  { node: <SiObsstudio />, title: "OBS Studio", href: "https://obsproject.com" }
];

const LandingPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const containerRef = useRef();

   useGSAP(() => {
    const tl = gsap.timeline({ delay: 1.2 }); //delay AFTER route animation
    tl.from(".hero-heading", {
      x: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    })
      .from(".hero-text",
        {
          x: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.5" // overlap for smooth flow
      );
  },
  { scope: containerRef }
);
  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden bg-black">

      <div className="absolute inset-0 
        bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] 
        bg-[size:18px_18px]"
      />

      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] mx-auto rounded-full
        bg-[radial-gradient(circle_460px_at_50%_300px,rgba(251,251,251,0.10),rgba(0,0,0,0))]"/>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 px-4 sm:px-6 md:px-10 flex flex-col justify-center items-center gap-3 text-center">
         <section ref={containerRef}>
           <h1 className="hero-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold leading-18 text-white">
            Free Movies to Watch <br className="hidden sm:block" /> Anytime Anywhere.
          </h1>
          <p className="hero-text text-sm sm:text-lg md:text-2xl max-w-[280px] sm:max-w-xl md:max-w-2xl text-gray-300 mt-2.5">
            The search is over! Let{" "}
            <span className="font-semibold text-white underline">
              StreamingVerse
            </span>{" "}
            help you find the perfect movie to watch tonight for free.
          </p>
         </section>

          <div className="flex justify-center items-center mt-3">
            {isAuthenticated ? (
              <Link to="/home">
                <button
                  className="flex items-center justify-center gap-2 w-[180px] h-[48px] sm:w-auto sm:h-auto
                    px-5 py-3 md:px-7 md:py-4 md:text-2xl
                    border-2 border-zinc-700 text-base sm:text-lg font-semibold cursor-pointer
                    bg-transparent hover:bg-zinc-900
                    transition">
                  Explore Videos <ArrowBigRight size={26} />
                </button>
              </Link>
            ) : (
              <WrapButton
                className="w-[220px] h-[55px] py-6
                  sm:w-auto sm:h-auto xl:w-[250px] xl:h-[65px] flex justify-center items-center
                  text-base sm:text-lg
                  font-semibold cursor-pointer"
                href="/docs/components/card-carousel"
              >
                Get Started
              </WrapButton>
            )}
          </div>

        </div>

        <div className="w-full mb-3.5">
          <LogoLoop
            logos={streamingLogos}
            speed={90}
            direction="right"
            logoHeight={50}
            gap={60}
            fadeOut />
        </div>

      </div>
    </div>
  )
}

export default LandingPage
