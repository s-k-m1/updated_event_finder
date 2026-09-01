import React, {useState, useEffect} from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    SlidersHorizontal,
    Heart,
    Calendar,
    Clock,
    MapPin,
    Star,
    ArrowRight
} from "lucide-react";

import { getEvents, getCategories, getLocations, getSavedIds, saveEvent, unsaveEvent, getNearbyEvents } from "../api";
import "./eventgrid.css";

const iconEmojis = {
  Music: "🎵", Laptop: "💻", Trophy: "⚽", BookOpen: "📖", Landmark: "🏛️",
  Briefcase: "💼", Utensils: "🍜", Palette: "🎨", Mountain: "⛰️",
};

export default function EventGrid(){

const [searchParams, setSearchParams] = useSearchParams();
const { user } = useAuth();
const [saved,setSaved]=useState([]);
const [events,setEvents]=useState([]);
const [categories,setCategories]=useState([]);
const [locations,setLocations]=useState([]);
const [searchText,setSearchText]=useState(searchParams.get("search") || "");
const [activeCategory,setActiveCategory]=useState(searchParams.get("category") || "");
const [activePrice,setActivePrice]=useState(searchParams.get("price") || "all");
const [activeSort,setActiveSort]=useState("latest");
const [activeDate,setActiveDate]=useState(searchParams.get("date") || "all");
const [location,setLocation]=useState(searchParams.get("location") || "");
const [view, setView] = useState("grid");

const cityLabel = (c) => (c ? c.charAt(0).toUpperCase() + c.slice(1) : "All Nepal");

useEffect(()=>{
  if (!user) { setSaved([]); return; }
  getSavedIds()
    .then((d) => setSaved(d.ids))
    .catch(err=>console.error("Failed to load saved ids:", err));
},[user]);

const toggleSave=(id)=>{

  if (!user) return;
  const isSaved = saved.includes(id);
  setSaved(isSaved ? saved.filter(item=>item!==id) : [...saved,id]);
  const action = isSaved ? unsaveEvent : saveEvent;
  action(id).catch(err=>{
    console.error("Failed to toggle save:", err);
    setSaved(isSaved ? [...saved,id] : saved.filter(item=>item!==id));
  });

}

useEffect(()=>{
  getCategories().then(setCategories).catch(err=>console.error("Failed to load categories:", err));
  getLocations().then(setLocations).catch(err=>console.error("Failed to load locations:", err));
},[]);

useEffect(()=>{
  setActiveDate(searchParams.get("date") || "all");
  setLocation(searchParams.get("location") || "");
  setSearchText(searchParams.get("search") || "");
  setActiveCategory(searchParams.get("category") || "");
  setActivePrice(searchParams.get("price") || "all");
},[searchParams]);

useEffect(()=>{
  const params = new URLSearchParams();
  if (activeCategory) params.set("category", activeCategory);
  if (activePrice !== "all") params.set("price", activePrice);
  if (activeSort !== "latest" && activeSort !== "nearby") params.set("sort", activeSort);
  if (searchText.trim()) params.set("search", searchText.trim());
  if (location) params.set("location", location);
  if (activeDate !== "all") params.set("date", activeDate);
  const qs = params.toString();

  if (activeSort === "nearby") {
    const fallback = { lat: 27.7172, lng: 85.3240 };
    const use = (c) => getNearbyEvents(c.lat, c.lng, 80)
      .then(setEvents)
      .catch(err=>console.error("Failed to load nearby events:", err));
    const locateByIP = () => {
      fetch("https://ipapi.co/json/")
        .then((r) => r.json())
        .then((d) => {
          if (!d || typeof d.latitude !== "number" || typeof d.longitude !== "number") throw new Error("IP lookup failed");
          use({ lat: d.latitude, lng: d.longitude });
        })
        .catch(() => use(fallback));
    };
    if (!navigator.geolocation) { locateByIP(); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => use({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => locateByIP(),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
    return;
  }

  getEvents(qs ? `?${qs}` : "")
    .then(setEvents)
    .catch(err=>console.error("Failed to load events:", err));
},[activeCategory, activePrice, activeSort, searchText, location, activeDate]);


return(

<section className="events-layout">


{/* FILTER SECTION */}

<aside className="filter-box">


<div className="filter-title">

<SlidersHorizontal/>

Filters

</div>


<h4>CATEGORY</h4>
{
categories.map((cat)=>(
  <div
    className={`category-item ${activeCategory === cat.slug ? "active-cat" : ""}`}
    key={cat.slug}
    onClick={() => setActiveCategory(activeCategory === cat.slug ? "" : cat.slug)}
  >
    <span className="cat-click">
      {iconEmojis[cat.iconName] || ""} {cat.name}
    </span>

    <span>
    {cat.eventCount}
    </span>

  </div>

))
}
<h4>LOCATION</h4>

<div className={`date-option ${location === "" ? "active-cat" : ""}`} onClick={() => setLocation("")}>
All Nepal
</div>

{locations.map((loc) => (
  <div
    key={loc}
    className={`date-option ${location === loc ? "active-cat" : ""}`}
    onClick={() => setLocation(location === loc ? "" : loc)}
  >
    {cityLabel(loc)}
  </div>
))}

<h4>DATE</h4>


<div className={`date-option ${activeDate === "all" ? "active-cat" : ""}`} onClick={() => setActiveDate("all")}>
All Dates
</div>

<div className={`date-option ${activeDate === "today" ? "active-cat" : ""}`} onClick={() => setActiveDate("today")}>
Today
</div>

<div className={`date-option ${activeDate === "tomorrow" ? "active-cat" : ""}`} onClick={() => setActiveDate("tomorrow")}>
Tomorrow
</div>

<div className={`date-option ${activeDate === "week" ? "active-cat" : ""}`} onClick={() => setActiveDate("week")}>
This Week
</div>

<div className={`date-option ${activeDate === "weekend" ? "active-cat" : ""}`} onClick={() => setActiveDate("weekend")}>
This Weekend
</div>

<div className={`date-option ${activeDate === "month" ? "active-cat" : ""}`} onClick={() => setActiveDate("month")}>
This Month
</div>




<h4>PRICE</h4>


<div className="price-buttons">

<button className={activePrice === "all" ? "active" : ""} onClick={() => setActivePrice("all")}>
All
</button>

<button className={activePrice === "free" ? "active" : ""} onClick={() => setActivePrice("free")}>
Free
</button>

<button className={activePrice === "paid" ? "active" : ""} onClick={() => setActivePrice("paid")}>
Paid
</button>

</div>



<h4>SORT BY</h4>


<div className={`sort ${activeSort === "latest" ? "active-sort" : ""}`} onClick={() => setActiveSort("latest")}>
Latest
</div>

<div className={`sort ${activeSort === "popular" ? "active-sort" : ""}`} onClick={() => setActiveSort("popular")}>
Popular
</div>


<div className={`sort ${activeSort === "nearby" ? "active-sort" : ""}`} onClick={() => setActiveSort("nearby")}>
Nearby
</div>
</aside>
{/* EVENT SECTION */}
<div className="events-right">

<div className="events-search-bar">
  <span className="search-icon">⌕</span>
  <input
    type="text"
    placeholder="Search events by title, location, or category..."
    value={searchText}
    onChange={(e) => {
      const v = e.target.value;
      setSearchText(v);
      const params = new URLSearchParams(searchParams);
      if (v.trim()) params.set("search", v.trim());
      else params.delete("search");
      setSearchParams(params);
    }}
  />
  {searchText && (
    <button className="es-clear" onClick={() => {
      setSearchText("");
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      setSearchParams(params);
    }}>✕</button>
  )}
</div>

<div className="events-header">
<div>

<strong>
{events.length}
</strong>
<span>
events found
</span>

</div>


<div className="view-buttons">

<button className={view === "grid" ? "active-view" : ""} onClick={() => setView("grid")}>
▦
</button>
<button className={view === "list" ? "active-view" : ""} onClick={() => setView("list")}>
☷
</button>

</div>
</div>
<div className={`event-grid${view === "list" ? " list-view" : ""}`}>


{
events.map(event=>(

<EventCard

key={event.id}

event={event}

saved={saved.includes(event.id)}

toggleSave={toggleSave}

/>

))

}


</div>



</div>



</section>

)

}
function EventCard({event,saved,toggleSave}){


return(

<div className="event-card">


<div className="event-image">

<img src={event.image}/>
{
event.badge &&

<span className="badge">
{event.badge}
</span>

}
<button
className="heart"
onClick={()=>toggleSave(event.id)}
>
<Heart className={saved?"saved":""}/>

</button>
<div className="image-bottom">
<span>
{event.category}
</span>


<span className="rating">
<Star/>
{event.rating}
</span>
<strong>
{event.price}
</strong>
</div>
</div>
<div className="card-body">
<h3>
{event.title}
</h3>
<p>
<Calendar/>
{event.date}
<Clock/>
{event.time}
</p>
<p>
<MapPin/>
{event.location}
</p>
<div className="card-footer">
<b>
{event.price}
</b>


<Link to={`/event/${event.slug}`} className="view-details-btn">
View Details
<ArrowRight/>
</Link>


</div>



</div>


</div>

)

}