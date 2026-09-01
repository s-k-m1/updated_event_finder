import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { getTrendingEvents } from "../api";
import "./trendingevents.css";


export default function TrendingEvents(){
const [trendingEvents, setTrendingEvents] = useState([]);

useEffect(() => {
  getTrendingEvents()
    .then((data) =>
      setTrendingEvents(
        data.map((e) => ({ title: e.title, date: e.date, badge: e.badge || "Trending", image: e.image, slug: e.slug }))
      )
    )
    .catch((err) => console.error("Failed to load trending events:", err));
}, []);




return(

<section className="trending-section">


<div className="trending-container">



<div className="trending-title">

<span></span>

TRENDING NOW

</div>





<div className="trending-wrapper">


{
trendingEvents.map((event,index)=>(


<div className="trending-card" key={index}>


<div className="trending-image">


<img 
src={event.image}
alt={event.title}
/>


<span 
className={
event.badge==="Featured"
?
"badge featured"
:
"badge trending"
}
>
{event.badge}
</span>


</div>



<div className="trending-content">


<h3>
{event.title}
</h3>



<div className="trending-date">

<Calendar/>

{event.date}

</div>

<Link to={`/event/${event.slug}`} className="trending-link">
View Details
</Link>


</div>



</div>


))
}



</div>



</div>


</section>


)


}