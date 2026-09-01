import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { getContent } from "../api";
import "./ctaSection.css";

export default function Ctasection(){

  const [cta, setCta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getContent("cta")
      .then(setCta)
      .catch((err) => console.error("Failed to load cta:", err));
  }, []);

  return (
    <section className="cta-section">

      <div className="cta-container">


        <div className="cta-card">


          <span className="cta-badge">
            {cta ? cta.badge : "GET STARTED"}
          </span>



          <h2>
            {cta ? cta.heading : "Start Exploring Events"}
          </h2>



          <p>
            {cta ? cta.paragraph : "Join thousands of Nepalis discovering and attending incredible local events every week."}
          </p>



          <div className="cta-buttons">


            <button className="browse-btn" onClick={() => navigate("/event")}>
              <Search />
              Browse Events
            </button>



            <button className="create-btn" onClick={() => navigate("/signup")}>
              Create Event
              <ArrowRight />
            </button>


          </div>


        </div>


      </div>


    </section>
  );
}