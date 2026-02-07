import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from "lucide-react"

const isValidSearch = (value) => {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length >= 4 && /[a-zA-Z0-9]/.test(trimmed);
}

const SearchBar = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setsearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (isValidSearch(value)) {
        navigate(`/search?q=${encodeURIComponent(value.trim())}`);
      }
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isValidSearch(searchQuery)) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="w-full px-3 sm:w-[40vw]xl:w-[45vw] xl:ml-7 flex justify-center lg:justify-start">
      <div className="flex items-center w-full sm:w-[40%] md:w-[58%] lg:w-[98%] xl:w-[45vw]">
        <input type="text"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search your movies"
          className="w-full px-3 sm:px-6 py-2 sm:py-2 bg-zinc-900 text-white rounded-l-full border border-zinc-800 focus:ring-1 focus:ring-zinc-700
            outline-none text-sm sm:text-sm md:text-base"/>

        <button type="submit"
          className="px-3 sm:px-3 md:px-4 py-2 sm:py-2
            bg-zinc-800 border border-l-0 border-zinc-800
           rounded-r-full hover:bg-zinc-700 transition focus:ring-1 focus:ring-zinc-700 outline-none">
          <Search className="w-4 h-4 sm:w-7 sm:h-7 xl:w-6 xl:h-6  text-white" />
        </button>
      </div>
    </div>
  )
}

export default SearchBar
