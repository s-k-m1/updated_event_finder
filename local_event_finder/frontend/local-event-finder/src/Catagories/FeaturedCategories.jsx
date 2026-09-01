import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Music,
  Laptop,
  Landmark,
  ChevronRight
} from "lucide-react";

import { getFeaturedCategories } from "../api";
import "./featuredcategories.css";


const iconMap = {
  Music: <Music />, Laptop: <Laptop />, Landmark: <Landmark />,
};

export default function FeaturedCategory(){

  const [featuredCategories, setFeaturedCategories] = useState([]);

  useEffect(() => {
    getFeaturedCategories()
      .then((data) =>
        setFeaturedCategories(
          data.map((c) => ({
            title: c.name,
            icon: iconMap[c.iconName] || <Music />,
            image: c.imageUrl,
            description: c.description,
            count: `${c.eventCount} events`,
            slug: c.slug,
          }))
        )
      )
      .catch((err) => console.error("Failed to load featured categories:", err));
  }, []);

  return (

    <section className="featured-category-section">

      <div className="featured-category-container">


        {/* Heading */}

        <div className="featured-category-header">

          <div className="featured-category-label">

            <span></span>

            FEATURED CATEGORIES

          </div>


          <h2>
            Top Picks Right Now
          </h2>


        </div>



        {/* Cards */}

        <div className="featured-category-grid">


          {
            featuredCategories.map((category,index)=>(


              <div 
                className="featured-category-card"
                key={index}
              >



                <div className="featured-category-image">


                  <img
                    src={category.image}
                    alt={category.title}
                  />



                  <div className="featured-category-overlay"></div>



                  <div className="featured-category-title">


                    <div className="category-icon">

                      {category.icon}

                    </div>



                    <h3>
                      {category.title}
                    </h3>


                  </div>



                </div>





                <div className="featured-category-content">


                  <p>
                    {category.description}
                  </p>




                  <div className="featured-category-footer">


                    <span>
                      {category.count}
                    </span>



                    <Link to={`/event?category=${category.slug}`} className="explore-btn">

                      Explore

                      <ChevronRight />

                    </Link>



                  </div>



                </div>



              </div>



            ))
          }



        </div>


      </div>


    </section>


  );

}