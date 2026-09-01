import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapPin, Filter, Navigation } from "lucide-react";
import { getNearbyEvents } from "../api";
import "./eventnear.css";

const DEFAULT_CENTER = { lat: 27.7172, lng: 85.3240 };
const KTM = { lat: 27.7172, lng: 85.3240 };

export default function EventsNear() {
  const [events, setEvents] = useState([]);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [locating, setLocating] = useState(false);
  const [usingMyLocation, setUsingMyLocation] = useState(false);
  const [activePin, setActivePin] = useState(null);
  const [radius, setRadius] = useState(80);
  const locateRef = useRef(null);

  const RADII = [80, 200, 400];

  const loadNearby = (c, r = radius) =>
    getNearbyEvents(c.lat, c.lng, r)
      .then(setEvents)
      .catch((err) => console.error("Failed to load nearby events:", err));

  const cycleRadius = () => {
    const next = RADII[(RADII.indexOf(radius) + 1) % RADII.length];
    setRadius(next);
    loadNearby(center, next);
  };

  useEffect(() => {
    loadNearby(KTM.lat, KTM.lng);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (locateRef.current && !locateRef.current.contains(e.target) && activePin !== null) {
        setActivePin(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [activePin]);

  // Position events relative to the map centre (a 0.6° lat × 0.6° lng box)
  const SPAN = 0.6;
  const position = (e) => {
    const dlng = ((e.lng - center.lng) / SPAN) * 100 + 50;
    const dlat = ((center.lat - e.lat) / SPAN) * 100 + 50;
    return {
      left: Math.max(8, Math.min(92, dlng)),
      top: Math.max(8, Math.min(92, dlat)),
    };
  };

  const enableMyLocation = () => {
    setLocating(true);
    if (!navigator.geolocation) {
      locateByIP();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const my = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(my);
        setUsingMyLocation(true);
        loadNearby(my);
        setLocating(false);
      },
      () => {
        locateByIP();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const pickCoords = (d) => {
    const lat = d?.latitude;
    const lng = d?.longitude;
    if (typeof lat === "number" && typeof lng === "number") {
      return { lat, lng };
    }
    return null;
  };

  const locateByIP = () => {
    const providers = [
      { url: "https://ipwho.is/", parse: pickCoords },
      { url: "https://ipapi.co/json/", parse: pickCoords },
    ];
    let idx = 0;
    const tryNext = () => {
      if (idx >= providers.length) {
        setLocating(false);
        loadNearby(DEFAULT_CENTER);
        return;
      }
      const p = providers[idx++];
      fetch(p.url, { signal: AbortSignal.timeout(8000) })
        .then((r) => r.json())
        .then((d) => {
          const my = p.parse(d);
          if (!my) throw new Error("IP lookup failed");
          setCenter(my);
          setUsingMyLocation(true);
          loadNearby(my);
          setLocating(false);
        })
        .catch(() => tryNext());
    };
    tryNext();
  };

  const activeEvent = events.find((e) => e.id === activePin);
  const closest = events.length ? Math.min(...events.map((e) => e.distance_km)) : null;
  const farthest = events.length ? Math.max(...events.map((e) => e.distance_km)) : 0;

  return (
    <section className="eventnear-section">

      <div className="eventnear-container">

        <div className="eventnear-header">

          <div>

            <div className="eventnear-label">
              <span></span>
              EXPLORE THE MAP
            </div>

            <h2>
              Events Near You
            </h2>

          </div>


          <div className="map-buttons">

            <button className="filter-btn" onClick={cycleRadius}>
              <Filter />
              {radius} km area
            </button>

            <button className="map-btn" onClick={enableMyLocation}>
              <Navigation />
              {locating ? "Locating..." : "Enable My Location"}
            </button>

          </div>


        </div>



        <div className="map-box" ref={locateRef}>

         

          {
            events.map((event)=>(
              <div
                key={event.id}
                className="map-pin"
                style={{
                  left:`${position(event).left}%`,
                  top:`${position(event).top}%`
                }}
                onClick={() => setActivePin(activePin === event.id ? null : event.id)}
              >
                <MapPin/>
                <span className="pin-label">{event.title.split(" ").slice(-2).join(" ")}</span>
              </div>
            ))
          }


         

          <div className="map-popup">

            <div className="popup-icon">
              <MapPin/>
            </div>

            {usingMyLocation ? (
              <>
                <h3>
                  {closest !== null ? `${events.length} events within ${farthest} km` : "No events found nearby"}
                </h3>
                {events.length > 0 ? (
                  <div className="map-popup-list">
                    {events.slice(0, 5).map((ev) => (
                      <div key={ev.id} className="map-popup-event">
                        <span className="popup-event-distance">{ev.distance_km} km away</span>
                        <Link to={`/event/${ev.slug}`} className="popup-event-link">View Details →</Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Enabling your location to find events around you</p>
                )}
                <button onClick={() => loadNearby(center)}>
                  Refresh Location
                </button>
              </>
            ) : (
              <>
                <h3>
                  Click a pin to explore
                </h3>

                <p>
                  Enable your location to see how far events are from you
                </p>

                <button onClick={enableMyLocation}>
                  {locating ? "Locating..." : "Enable My Location"}
                </button>
              </>
            )}

          </div>

          {events.length > 0 && usingMyLocation && (
            <div className="map-event-list">
              <h4>Nearby Events</h4>
              {events.slice(0, 6).map((ev) => (
                <Link key={ev.id} to={`/event/${ev.slug}`} className="map-event-list-item">
                  <img src={ev.image} alt={ev.title} />
                  <div>
                    <strong>{ev.title}</strong>
                    <span>{ev.city ? ev.city.charAt(0).toUpperCase() + ev.city.slice(1) : ev.location}</span>
                    <small>{ev.distance_km} km away</small>
                  </div>
                  <span className="map-event-details">View Details →</span>
                </Link>
              ))}
            </div>
          )}

          {activeEvent && (
            <div className="map-event-card" style={{ left:`${Math.max(8, Math.min(70, position(activeEvent).left))}%`, top:`${Math.max(8, Math.min(60, position(activeEvent).top))}%` }}>
              <img src={activeEvent.image} alt={activeEvent.title} />
              <div>
                <strong>{activeEvent.title}</strong>
                <span>{activeEvent.city ? activeEvent.city.charAt(0).toUpperCase()+activeEvent.city.slice(1) : activeEvent.location}</span>
                <small>{activeEvent.distance_km} km away</small>
                <Link to={`/event/${activeEvent.slug}`}>View Details →</Link>
              </div>
            </div>
          )}



          <div className="map-legend">

            <div>
              <span className="music"></span>
              {events.length} Nearby
            </div>


            <div>
              <span className="tech"></span>
              {closest !== null ? `${closest} km closest` : "—"}
            </div>


            <div>
              <span className="sports"></span>
              {farthest ? `${farthest} km radius` : "—"}
            </div>


          </div>


        </div>


      </div>


    </section>
  );
}