import React, { useState, useEffect } from "react";
import { getContent } from "../api";
import "./ourmission.css";

const OurMission = () => {

  const [stats, setStats] = useState([]);
  const [content, setContent] = useState({});

  useEffect(() => {
    getContent("mission")
      .then((data) => {
        setStats(data.stats || []);
        setContent(data);
      })
      .catch((err) => console.error("Failed to load mission content:", err));
  }, []);

  return (
    <section className="mission-section">

      <div className="mission-container">


        {/* Left Content */}

        <div className="mission-content">

          <div className="mission-label">
            <span></span>
            OUR MISSION
          </div>


          <h1>
            {content.heading || "Bringing Nepal's Communities"}
            <br />
            {content.heading_break || "Together Through Events"}
          </h1>


          <p>
            {content.paragraphs && content.paragraphs[0]}
          </p>


          <p>
            {content.paragraphs && content.paragraphs[1]}
          </p>



          <div className="stats-grid">

            {stats.map((item, index) => (

              <div className="stat-card" key={index}>

                <div className="stat-icon">
                  {item.icon}
                </div>


                <div>
                  <h3>
                    {item.number}
                  </h3>

                  <span>
                    {item.label}
                  </span>
                </div>


              </div>

            ))}

          </div>


        </div>



        {/* Right Image */}

        <div className="mission-image-area">


          <img
            src={content.image}
            alt="Community event"
            className="mission-image"
          />



          <div className="trusted-card">

            <div className="trusted-icon">
              ★
            </div>


            <div>

              <h4>
                {content.trusted?.title || "Trusted Platform"}
              </h4>

              <p>
                {content.trusted?.text || ""}
              </p>

            </div>

          </div>


        </div>



      </div>


    </section>
  );
};


export default OurMission;