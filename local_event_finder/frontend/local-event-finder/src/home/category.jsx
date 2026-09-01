import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategories } from "../api";
import "./category.css";
import {
  Music,
  Laptop,
  Trophy,
  BookOpen,
  Landmark,
  Briefcase,
  Utensils,
  Palette,
  Mountain,
} from "lucide-react";

const iconMap = {
  Music, Laptop, Trophy, BookOpen, Landmark, Briefcase, Utensils, Palette, Mountain,
};
export default function CategorySection() {

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then((data) =>
        setCategories(
          data.slice(0, 6).map((c) => ({
            name: c.name,
            slug: c.slug,
            count: c.eventCount,
            icon: iconMap[c.iconName] || Music,
            bg: c.bgColor,
          }))
        )
      )
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  return (

    <section className="category-section">


      <div className="category-container">



        {/* Heading Area */}

        <div className="category-header">


          <div>


            <div className="category-label">

              <span></span>

              EXPLORE BY CATEGORY

            </div>



            <h2>
              What Are You Into?
            </h2>


          </div>



          <Link to="/categories" className="category-link">

            All Categories

            <ArrowRight />

          </Link>
        </div>
      
 <div className="category-grid">
                    {
                        categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Link to={`/event?category=${category.slug}`}
                                    className="category-card"
                                    key={category.name}
                                    style={{ textDecoration: "none" }}>
                                    <div
                                        className="category-icon"
                                        style={{
                                            backgroundColor: category.bg
                                        }}>
                                        <Icon />
                                    </div>
                                    <div className="category-name">
                                        {category.name}
                                    </div>
                                    <div className="category-count">
                                        {category.count} events
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
                </div>

    </section>


  );


}