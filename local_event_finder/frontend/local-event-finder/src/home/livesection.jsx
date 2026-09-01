import React, { useEffect, useState } from "react";
import { MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { getLiveEvents } from "../api";
import "./liveevent.css";

export default function Livesection(){
const [liveEvents, setLiveEvents] = useState([]);

useEffect(() => {
  getLiveEvents()
    .then((data) =>
      setLiveEvents(
        data.map((e) => ({
          slug: e.slug,
          title: e.title,
          time: e.live_ago,
          location: e.location,
          attendees: `${e.attendees} attending`,
        }))
      )
    )
    .catch((err) => console.error("Failed to load live events:", err));
}, []);

return (

<section className="live-section">

<div className="live-container">


<div className="live-header">


<div className="live-heading">


<div className="live-now">

<span className="live-pulse">

<span></span>

</span>

LIVE NOW

</div>


<h3>
Events Happening Right Now
</h3>


</div>


<div className="active-pill">
{liveEvents.length} Active
</div>


</div>




<div className="live-card-wrapper">


{
liveEvents.map((event,index)=>(


<Link 
className="live-card live-card-link"
to={`/event/${event.slug}`}
key={event.slug}
>


<div className="live-card-top">


<div className="live-status">


<span className="card-dot"></span>

LIVE


</div>


<span className="live-time">

{event.time}

</span>


</div>



<h4>
{event.title}
</h4>



<div className="live-info">

<MapPin/>

<span>
{event.location}
</span>

</div>


<div className="live-info">

<Users/>

<span>
{event.attendees}
</span>


</div>



</Link>

))
}


</div>


</div>


</section>

);

}