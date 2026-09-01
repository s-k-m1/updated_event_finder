import React from "react";
import Navigation from "../home/navigationbar.jsx";
import ExploreEvents from "./ExploreEvents.jsx";
import TrendingEvents from "./TrendingEvents.jsx";
import EventGrid from "./EventGrid.jsx";
export default function Event(){
    return(<>
    <Navigation />
    <ExploreEvents />
    <TrendingEvents />
    <EventGrid />
    </>)
}