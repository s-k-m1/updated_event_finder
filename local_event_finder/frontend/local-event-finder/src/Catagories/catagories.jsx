import React from "react";
import Navigation from "../home/navigationbar.jsx";
import ExploreCategory from "./ExploreCategory.jsx";
import AllCategories from "./AllCategories.jsx";
import FeaturedCategories from "./FeaturedCategories.jsx";
import Footer from "../home/Footer.jsx";
export default function Catagories() {
  return (
    <div>
      <Navigation />
      <ExploreCategory />
      <AllCategories />
      <FeaturedCategories /> 
      <Footer />
    </div>
  );
}