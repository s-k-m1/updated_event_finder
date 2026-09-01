import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Search,
    MapPin,
    Calendar,
    ChevronDown
} from "lucide-react";

import { getLocations } from "../api";
import "./exploreevents.css";


export default function ExploreEvents(){


const [searchParams] = useSearchParams();
const [search,setSearch]=useState(searchParams.get("search") || "");
const [location,setLocation]=useState(searchParams.get("location") || "");
const [locations,setLocations]=useState([]);
const [date,setDate]=useState(searchParams.get("date") || "");
const [locOpen,setLocOpen]=useState(false);
const [dateOpen,setDateOpen]=useState(false);
const locRef = useRef(null);
const dateRef = useRef(null);
const navigate = useNavigate();

useEffect(()=>{
  getLocations().then(setLocations).catch(err=>console.error("Failed to load locations:", err));
},[]);

// Keep the search box / dropdowns in sync with the URL so a stale
// search term from a previous query never silently sabotages a
// date/location selection.
useEffect(()=>{
  setSearch(searchParams.get("search") || "");
  setLocation(searchParams.get("location") || "");
  setDate(searchParams.get("date") || "");
},[searchParams]);

useEffect(()=>{
  const onClick=(e)=>{
    if(locRef.current && !locRef.current.contains(e.target)) setLocOpen(false);
    if(dateRef.current && !dateRef.current.contains(e.target)) setDateOpen(false);
  };
  document.addEventListener("mousedown", onClick);
  return ()=>document.removeEventListener("mousedown", onClick);
},[]);

const cityLabel = (c) => (c ? c.charAt(0).toUpperCase()+c.slice(1) : "All Nepal");

const dateLabel = (d) => {
  if (d === "today") return "Today";
  if (d === "tomorrow") return "Tomorrow";
  if (d === "week") return "This Week";
  if (d === "weekend") return "This Weekend";
  if (d === "month") return "This Month";
  return "Any Date";
};

const applySearch = ()=>{
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (location) params.set("location", location);
  if (date) params.set("date", date);
  navigate(`/event?${params.toString()}`);
};

// Apply filters immediately when a dropdown option is chosen (no Search click needed)
const applyWith = (updates = {}) => {
  const params = new URLSearchParams();
  const s = updates.search !== undefined ? updates.search : search;
  const loc = updates.location !== undefined ? updates.location : location;
  const dt = updates.date !== undefined ? updates.date : date;
  if (s.trim()) params.set("search", s.trim());
  if (loc) params.set("location", loc);
  if (dt) params.set("date", dt);
  navigate(`/event?${params.toString()}`);
};


return(

<section className="explore-section">


<div className="explore-container">


{/* Small heading */}

<div className="explore-label">

<span></span>

EXPLORE EVENTS

</div>



<h1>
Explore Events
</h1>


<p>
Discover events happening across Nepal
</p>




{/* Search bar */}

<div className="explore-search">


<div className="search-input">

<Search/>

<input
type="text"
placeholder="Search events, keywords..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
onKeyDown={(e)=>e.key==="Enter" && applySearch()}
/>

</div>




<div className="search-option" ref={locRef} onClick={()=>{ setLocOpen(o=>!o); setDateOpen(false); }}>

<MapPin/>

<span>
{cityLabel(location)}
</span>

<ChevronDown/>

{locOpen && (
  <div className="explore-location-dropdown">
    <div className={`explore-location-option ${location === "" ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setLocation(""); setLocOpen(false); applyWith({ location: "" }); }}>
      All Nepal
    </div>
    {locations.map((loc)=>(
      <div key={loc} className={`explore-location-option ${location === loc ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setLocation(loc); setLocOpen(false); applyWith({ location: loc }); }}>
        {cityLabel(loc)}
      </div>
    ))}
  </div>
)}

</div>




<div className="search-option" ref={dateRef} onClick={()=>{ setDateOpen(o=>!o); setLocOpen(false); }}>

<Calendar/>

<span>
{dateLabel(date)}
</span>

<ChevronDown/>

{dateOpen && (
  <div className="explore-location-dropdown">
    <div className={`explore-location-option ${date === "" ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setDate(""); setDateOpen(false); applyWith({ date: "" }); }}>
      Any Date
    </div>
    <div className={`explore-location-option ${date === "today" ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setDate("today"); setDateOpen(false); applyWith({ date: "today" }); }}>
      Today
    </div>
    <div className={`explore-location-option ${date === "tomorrow" ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setDate("tomorrow"); setDateOpen(false); applyWith({ date: "tomorrow" }); }}>
      Tomorrow
    </div>
    <div className={`explore-location-option ${date === "week" ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setDate("week"); setDateOpen(false); applyWith({ date: "week" }); }}>
      This Week
    </div>
    <div className={`explore-location-option ${date === "weekend" ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setDate("weekend"); setDateOpen(false); applyWith({ date: "weekend" }); }}>
      This Weekend
    </div>
    <div className={`explore-location-option ${date === "month" ? "selected" : ""}`} onClick={(e)=>{ e.stopPropagation(); setDate("month"); setDateOpen(false); applyWith({ date: "month" }); }}>
      This Month
    </div>
  </div>
)}

</div>




<button className="search-btn" onClick={applySearch}>

Search

</button>



</div>



</div>


</section>


)
}