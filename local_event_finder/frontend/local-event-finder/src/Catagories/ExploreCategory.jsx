import React, { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./explorecategory.css";

export default function ExploreCategory() {

  const [search,setSearch] = useState("");
  const navigate = useNavigate();

  const applySearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    navigate(`/categories?${params.toString()}`);
  };

  return (
    <section className="explore-category">

      <div className="explore-container">

        {/* Label */}
        <div className="explore-label">
          <span></span>
          BROWSE BY CATEGORY
        </div>


        {/* Heading */}
        <h1>
          Browse by Categories
        </h1>


        {/* Description */}
        <p>
          Find events based on your interests
        </p>


        {/* Search */}
        <div className="category-search">

          <Search />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            onKeyDown={(e)=>e.key==="Enter" && applySearch()}
          />

        </div>


      </div>

    </section>
  );
}