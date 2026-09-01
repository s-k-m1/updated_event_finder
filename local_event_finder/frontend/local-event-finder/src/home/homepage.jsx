import React from "react";
import Navigation from "./navigationbar.jsx";
import Livesection from "./livesection.jsx";
import HeroSection from "./Herosection.jsx";
import CategorySection from "./category.jsx";
import FeaturedEvents from "./FeaturedEvent.jsx";
import EventsNear from "./EventNear.jsx";
import Footer from "./Footer.jsx";
function Home() {

    return (<>
        <Navigation />
        <Livesection />
        <HeroSection />
        <CategorySection />
        <FeaturedEvents />
        <EventsNear />
        <Footer />
    </>)
}
export default Home