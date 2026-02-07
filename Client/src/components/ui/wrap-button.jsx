import React from "react"
import { Link } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react"
import { cn } from "@/components/lib/utils"

const WrapButton = ({ className, children, href }) => {
  return (
    <div className="flex items-center justify-center">
      {href ? (
        <Link to="/signup">
          <div
            className={cn(
              "group relative cursor-pointer flex items-center rounded-full",
              "border border-white/20 bg-white/5 backdrop-blur-md",
              className
            )}>
            <button
              className="relative z-10 inline-flex h-10 items-center justify-center gap-2 px-3 py-3 md:px-10 md:py-6 md:text-2xl
              rounded-xs xl:px-1 xl:py-5 font-semibold
              bg-white/10 lg:p-7 lg:gap-2.5 lg:text-2xl xl:gap-1.5
              border border-white/20
              text-white cursor-pointer
              transition-all duration-300
              hover:bg-white/20 hover:-translate-y-[1px]"
            >
              <Globe
                size={22}
                className="animate-[spin_3s_linear_infinite] opacity-70"
              />

              <span>{children}</span>
            </button>
            <div
              className="absolute inset-0 -z-10 rounded-full
              bg-gradient-to-b from-[#c7d2fe] to-[#8678f9]
              opacity-15 blur-[2px]
              transition-all duration-300
              group-hover:opacity-25"/>
            <div
              className="ml-2 text-white/70 group-hover:ml-3
              ease-in-out transition-all
              xl:size-[34px] lg:size-[44px] flex items-center justify-center
              rounded-full border border-white/30">
              <ArrowRight
                size={22}
                className="lg:h-[5vh] xl:h-[2.5vh] group-hover:rotate-45 transition-all"
              />
            </div>
          </div>
        </Link>
      ) : (
        <div
          className={cn(
            "group relative cursor-pointer gap-2 flex items-center p-[6px] rounded-full",
            "border border-white/20 bg-white/5 backdrop-blur-md cursor-pointer",
            className)}>
          <div
            className="relative z-10 inline-flex h-12 items-center justify-center gap-2
            rounded-md px-6 font-semibold
            bg-white/10
            border border-white/20
            text-white cursor-pointer
            transition-all duration-300
            hover:bg-white/20 hover:-translate-y-[1px]"
          >
            <Globe
              // size={18}
              className="lg:h-[15vh] animate-[spin_8s_linear_infinite] opacity-70"
            />
            <p className="font-medium tracking-tight">
              {children ? children : "Get Started"}
            </p>
          </div>
          <div
            className="absolute inset-0 -z-10 rounded-full
            bg-gradient-to-b from-[#c7d2fe] to-[#8678f9]
            opacity-15 blur-[2px]
            transition-all duration-300
            group-hover:opacity-25"
          />
          <div
            className="ml-2 text-white/70 group-hover:ml-3
            ease-in-out transition-all
            size-[26px] flex items-center justify-center
            rounded-full border border-white/30"
          >
            <ArrowRight
              size={18}
              className="group-hover:rotate-45 transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WrapButton;
