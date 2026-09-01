import React, { useState, useEffect } from "react";
import { getContent } from "../api";
import "./howitworks.css";

const HowItWork = () => {

  const [steps, setSteps] = useState([]);

  useEffect(() => {
    getContent("how_it_works")
      .then((data) => setSteps(data.steps || []))
      .catch((err) => console.error("Failed to load how-it-works steps:", err));
  }, []);

  return (
    <section className="how-section">


      <div className="how-header">

        <div className="how-label">

          <span></span>

          HOW IT WORKS

          <span></span>

        </div>


        <h2>
          Three Simple Steps
        </h2>

      </div>




      <div className="steps-container">


        {steps.map((step, index) => (

          <React.Fragment key={step.number}>


            <div className="step-card">


              <div className="step-top">


                <div className="step-icon">
                  {step.icon}
                </div>


                <div className="step-number">
                  {step.number}
                </div>


              </div>



              <h3>
                {step.title}
              </h3>


              <p>
                {step.description}
              </p>



            </div>


            {index !== steps.length - 1 && (
              <div className="step-line"></div>
            )}


          </React.Fragment>

        ))}


      </div>


    </section>
  );
};


export default HowItWork;