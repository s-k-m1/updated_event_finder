import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Music,
    Laptop,
    Trophy,
    BookOpen,
    Landmark,
    Briefcase,
    Utensils,
    Palette,
    Mountain
} from "lucide-react";

import { getCategories } from "../api";
import "./allcategories.css";


const iconMap = {
  Music: Music, Laptop: Laptop, Trophy: Trophy, BookOpen: BookOpen,
  Landmark: Landmark, Briefcase: Briefcase, Utensils: Utensils,
  Palette: Palette, Mountain: Mountain,
};

export default function AllCategories() {

    const [categories, setCategories] = useState([]);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";

    useEffect(() => {
      getCategories()
        .then((data) =>
          setCategories(
            data.map((c) => ({
              slug: c.slug,
              name: c.name,
              count: c.eventCount,
              icon: iconMap[c.iconName] || Music,
              bg: c.bgColor,
            }))
          )
        )
        .catch((err) => console.error("Failed to load categories:", err));
    }, []);

    const filtered = useMemo(() => {
      if (!search.trim()) return categories;
      const q = search.trim().toLowerCase();
      return categories.filter((c) => c.name.toLowerCase().includes(q));
    }, [categories, search]);

    return (
        <section className="all-category-section">

            <div className="all-category-container">
{/* Header */}

                <div className="category-title">
                    <div className="category-label">

                        <span></span>
                        ALL CATEGORIES

                    </div>
                    <h2>
                        What Are You Into?
                    </h2>

                </div>
                {/* Cards */}

                <div className="category-grid">
                    {
                        filtered.map((category) => {

                            const Icon = category.icon;
                            return (
                                <Link
                                    to={`/event?category=${category.slug}`}
                                    className="category-card"
                                    key={category.name}>
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
    )

}