import React from "react";

const PageLoader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">

            <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                <span className="w-3 h-3 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
                <span className="w-3 h-3 rounded-full bg-white animate-bounce" />
            </div>

            <p className="mt-4 text-sm text-gray-400 tracking-wide">
                Loading content...
            </p>

            <div className="pointer-events-none absolute inset-0 opacity-30 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),
            linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:18px_18px]"/>
        </div>
    );
};

export default PageLoader;
