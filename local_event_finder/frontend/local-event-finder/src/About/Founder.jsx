import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { getContent } from "../api";
import "./Founder.css";
export default function Founder() {

  const [founder, setFounder] = useState({});

  useEffect(() => {
    getContent("founder")
      .then(setFounder)
      .catch((err) => console.error("Failed to load founder info:", err));
  }, []);

  return (
    <section className="founder-section">

      <div className="founder-container">

        {/* Heading */}

        <div className="founder-heading">

          <div className="section-label">
            <span></span>
            FOUNDER
            <span></span>
          </div>

          <h2>
            The Person Behind the Platform
          </h2>

        </div>


        {/* Founder Card */}

        <div className="founder-card">


          {/* Image */}

          <div className="founder-image">

            <img
              src={founder.image}
              alt={`${founder.name || "Founder"} Founder`}
            />

          </div>



          {/* Content */}

          <div className="founder-content">


            <div className="quote-icon">

              <Quote />

            </div>



            <p className="founder-text">

              {founder.quote}

            </p>


            <div className="founder-divider"></div>



            <div className="founder-profile">


              <div className="profile-circle">
                {founder.initials || "PB"}
              </div>


              <div>

                <h3>
                  {founder.name || "Parika Bhandari"}
                </h3>


                <p>
                  {founder.role || "Founder & CEO"}
                </p>

              </div>


            </div>


          </div>


        </div>


      </div>


    </section>
  );
}