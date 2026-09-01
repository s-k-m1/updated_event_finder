import React from "react";
import Navigation from "./home/navigationbar.jsx";
import SavedEvents from "./SavedEvents.jsx";
import Footer from "./home/Footer.jsx";

export default function SavedPage() {
  return (
    <>
      <Navigation />
      <SavedEvents />
      <Footer />
    </>
  );
}