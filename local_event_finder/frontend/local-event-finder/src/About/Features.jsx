import React, { useState, useEffect } from "react";
import { getContent } from "../api";
import "./features.css";

const Features = () => {

  const [features, setFeatures] = useState([]);

  useEffect(() => {
    getContent("features")
      .then((data) => setFeatures(data.features || []))
      .catch((err) => console.error("Failed to load features:", err));
  }, []);

  return (
    <section className="features-section">


      <div className="features-header">

        <div className="features-label">
          <span></span>
          FEATURES
          <span></span>
        </div>


        <h2>
          Everything You Need
        </h2>

      </div>



      <div className="features-grid">


        {features.map((feature) => (

          <div 
            className="feature-card"
            key={feature.title}
          >


            <div className={`feature-icon ${feature.iconClass}`}>
              {feature.icon}
            </div>


            <h3>
              {feature.title}
            </h3>


            <p>
              {feature.description}
            </p>


          </div>

        ))}


      </div>


    </section>
  );
};


export default Features;