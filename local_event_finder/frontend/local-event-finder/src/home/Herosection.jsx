import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  LayoutGrid,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getContent, getLocations } from "../api";
import "./herosection.css";


export default function HeroSection(){

const [stats, setStats] = useState([]);
const [locations, setLocations] = useState([]);
const [query, setQuery] = useState("");
const [location, setLocation] = useState("");
const [open, setOpen] = useState(false);
const dropRef = useRef(null);
const navigate = useNavigate();

const cityLabel = (c) =>
  c ? c.charAt(0).toUpperCase() + c.slice(1) : "All Nepal";

useEffect(() => {
  getContent("hero_stats")
    .then((data) => setStats(data.stats || []))
    .catch((err) => console.error("Failed to load hero stats:", err));
  getLocations()
    .then(setLocations)
    .catch((err) => console.error("Failed to load locations:", err));
}, []);

useEffect(() => {
  const onClick = (e) => {
    if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
  };
  document.addEventListener("mousedown", onClick);
  return () => document.removeEventListener("mousedown", onClick);
}, []);

const go = (search = query, loc = location) => {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (loc) params.set("location", loc);
  navigate(`/event${params.toString() ? `?${params.toString()}` : ""}`);
};

const search = (e) => {
  e.preventDefault();
  go();
};

const popular = ["This Weekend", "Free Events", "Tech", "Music", "Near Me"];

const applyPopular = (tag) => {
  if (tag === "Free Events") {
    const params = new URLSearchParams({ price: "free" });
    navigate(`/event?${params.toString()}`);
  } else if (tag === "Tech" || tag === "Music") {
    const params = new URLSearchParams({ category: tag.toLowerCase() });
    navigate(`/event?${params.toString()}`);
  } else if (tag === "Near Me") {
    setLocation("Kathmandu");
    const params = new URLSearchParams({ location: "kathmandu" });
    navigate(`/event?${params.toString()}`);
  } else if (tag === "This Weekend") {
    const params = new URLSearchParams({ date: "week" });
    navigate(`/event?${params.toString()}`);
  }
};

return (

<section className="hero-section">


<div className="hero-circle hero-circle-one"></div>
<div className="hero-circle hero-circle-two"></div>
<div className="hero-circle hero-circle-three"></div>



<div className="hero-container">



{/* Badge */}

<div className="hero-badge">

<span>NP</span>

Nepal's #1 Event Discovery Platform

</div>
{/* Heading */}
<h1>
Find Events 
<span>
Near You
</span>

</h1>




<p className="hero-description">

Discover, register, and experience the best local events across Nepal — concerts, workshops, tech summits, and cultural festivals.

</p>




{/* Search Box */}


<form className="hero-search" onSubmit={search}>

<div className="search-input-box">

<Search/>

<input 
type="text"
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Search events, workshops, concerts..."
/>

</div>




<div className="search-location" ref={dropRef} onClick={() => setOpen(!open)}>

<MapPin/>

<span>
{cityLabel(location)}
</span>

<ChevronDown/>

{open && (
  <div className="location-dropdown">
    <div className={`location-option ${location === "" ? "selected" : ""}`} onClick={() => { setLocation(""); setOpen(false); }}>
      All Nepal
    </div>
    {locations.map((loc) => (
      <div
        key={loc}
        className={`location-option ${location === loc ? "selected" : ""}`}
        onClick={(e) => { e.stopPropagation(); setLocation(loc); setOpen(false); }}
      >
        {cityLabel(loc)}
      </div>
    ))}
  </div>
)}

</div>




<button className="search-button" type="submit">

Search

</button>


</form>





{/* Popular Tags */}


<div className="popular-section">


<span className="popular-title">
Popular:
</span>

{popular.map((tag) => (
  <button key={tag} type="button" onClick={() => applyPopular(tag)}>
    {tag}
  </button>
))}

</div>

{/* Buttons */}


<div className="hero-buttons">


<button className="browse-button" onClick={() => navigate("/event")}>

<LayoutGrid/>

Browse Events

</button>



<button className="create-button" onClick={() => navigate("/signup")}>

<Plus/>

Create Event

</button>



</div>

{/* Statistics */}
<div className="hero-stats">

{stats.map((stat, index) => (
  <div key={index}>

      <h2>
        {stat.number}
      </h2>

      <p>
        {stat.label}
      </p>

  </div>
))}

</div>




</div>


</section>


);


}