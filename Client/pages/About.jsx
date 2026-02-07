import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Play, Search, Heart, User, } from "lucide-react";

const About = () => {
    const navigate = useNavigate();
    const containerRef = useRef();

    useGSAP(
        () => {
            gsap.to(".feature-card", {
                y: -18,
                duration: 1.3,
                ease: "power1.inOut",
                repeat: -1,
                yoyo: true,
                stagger: {
                    each: 0.2,
                    from: "edges",
                },
            });
        },
        { scope: containerRef }
    );

    return (
        <main className="min-h-screen pt-22">
            <div className="max-w-7xl mx-auto px-4 space-y-12">
                <section className="bg-gradient-to-r from-[#e8efff] to-[#dbe8ff] rounded-sm p-14 flex flex-col lg:flex-row items-center gap-16 shadow-md">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1e2a5a] leading-tight">
                            About <span className="text-blue-600"
                                style={{ fontFamily: '"Permanent Marker", cursive' }}>StreamingVerse</span>
                        </h1>
                        <p className="mt-6 text-gray-600 max-w-lg text-lg">
                            A modern video streaming platform for creators and viewers, designed to be fast, clean, and developer-focused, built as a hands-on project to explore real-world streaming workflows and full-stack architecture.
                        </p>
                        <button onClick={() => navigate("/home")}
                            className="mt-8 bg-blue-600 cursor-pointer text-white px-8 py-4 rounded-xs text-lg hover:bg-blue-700 transition">
                            Explore Now
                        </button>
                    </div>

                    <div className="flex-1 flex justify-center relative">
                        <div className="absolute w-[520px] h-[400px] bg-gradient-to-br from-blue-400 to-blue-600 opacity-50 blur-3xl rounded-full" />
                        <div className="relative w-[500px] h-[280px] bg-blue-500 rounded-3xl shadow-xl flex items-center justify-center">
                            <Play className="text-white w-24 h-24" />

                            <div className="absolute -bottom-10 -right-6 w-40 h-24 bg-blue-400 rounded-2xl opacity-90" />
                        </div>
                    </div>
                </section>

                <section className="px-2 text-center relative">
                    <div className="absolute inset-x-0 top-8 flex justify-center -z-10">
                        <div className="w-[420px] h-[120px] bg-gradient-to-r from-blue-400 to-blue-600 opacity-35 blur-3xl rounded-full" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-semibold text-blue-600">
                        Why I Built StreamingVerse
                    </h2>
                    <p className="mt-5 mx-auto text-white/80 leading-relaxed max-w-4xl text-xl">
                        StreamingVerse was built as a hands-on learning project to understand how
                        real-world video platforms operate. From frontend performance optimization
                        to backend architecture, this project focuses on scalability, clarity, and
                        clean development practices.
                    </p>
                </section>

                <section ref={containerRef}>
                    <h2 className="text-3xl font-semibold text-center text-blue-700">
                        Features
                    </h2>
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[{
                            icon: Play,
                            title: "Watch & Upload",
                            desc: "Seamlessly stream content and upload videos with a smooth, intuitive experience."
                        },
                        {
                            icon: Search,
                            title: "Smart Search",
                            desc: "Quickly discover relevant videos using optimized search and filtering."
                        },
                        {
                            icon: Heart,
                            title: "Save Favorites",
                            desc: "Bookmark and revisit your favorite videos anytime with ease."
                        },
                        {
                            icon: User,
                            title: "Channel Control",
                            desc: "Create, customize, and manage your channel with full control."
                        },

                        ].map((item, i) => (
                                <div key={i}
                                    className="feature-card backdrop-blur-md bg-white rounded-md p-8 text-center shadow hover:shadow-lg hover:scale-105 cursor-pointer transition">
                                    <item.icon className="mx-auto text-blue-600 w-12 h-12" />
                                    <h3 className="mt-5 font-semibold text-[#1e2a5a] text-lg">
                                        {item.title}
                                    </h3>
                                    <p className="mt-2 text-gray-600">{item.desc}</p>
                                </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-semibold text-center text-blue-600">
                        Tech Stack
                    </h2>
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 place-items-center">
                        {[{ name: "React", logo: "https://logo.svgcdn.com/logos/react.svg" },
                        { name: "Tailwind", logo: "https://logo.svgcdn.com/logos/tailwindcss.svg" },
                        { name: "Node.js", logo: "../src/assets/nodejs-default.png" },
                        { name: "MongoDB", logo: "../src/assets/mongodb-icon.png" },
                        { name: "JWT", logo: "../src/assets/jwt-seeklogo.png" },
                        ].map((tech, i) => (
                            <div key={i}
                                className="flex flex-col items-center gap-2 backdrop-blur-md bg-white rounded-sm border-2 border-white cursor-pointer px-12 py-8 shadow hover:scale-105 transition">
                                <img src={tech.logo}
                                    alt={tech.name}
                                    className="w-18 h-18 object-contain" />
                                <span className="text-md font-medium text-[#1e2a5a]">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="text-center py-4">
                    <p className="text-blue-600 font-medium text-lg">
                        Built with ❤️ by Harshit Verma
                    </p>
                    <p className="text-gray-300 text-sm mt-0.5">
                        Version 1.0 · Learning Project
                    </p>
                </section>
            </div>
        </main>
    );
};

export default About;
