import React, { useState, useEffect } from "react";
import { getContent } from "../api";
import "./abouthero.css";

export default function AboutHero() {

  const [hero, setHero] = useState(null);

  useEffect(() => {
    getContent("about_hero")
      .then(setHero)
      .catch((err) => console.error("Failed to load about hero:", err));
  }, []);

  return (

    <section className="about-hero">

      <div className="about-container">


        <div className="about-label">

          <span></span>

          {hero ? hero.label : "ABOUT US"}

        </div>



        <h1>
          {hero ? hero.heading : "About "}
          {hero ? hero.heading_span : "Local Event "}
          <br />
          {hero ? hero.heading_break : "Finder"}
        </h1>



        <p>
          {hero ? hero.description : "Connecting people with local events across Nepal — concerts, workshops, tech summits, and cultural festivals."}
          <br />
          {hero && hero.subtext ? hero.subtext : ""}
        </p>



      </div>


    </section>

  );

}