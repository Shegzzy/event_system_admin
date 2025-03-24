import "./featuredInfo.css";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function FeaturedInfo() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("date"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpcomingEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="featuredContainer">
      <div className="featuredHeader">
        <h2 className="featuredTitle">Upcoming Events</h2>
        <button className="viewAllBtn" onClick={() => navigate("/events")}>View All</button>
      </div>

      <div className="featured">
        {upcomingEvents.map((event) => {
          return (
            <div key={event.id} className="featuredItem">
              {/* Date Box */}
              <div className="eventDateBox">
                <span className="eventDay">{format(new Date(event.date), "dd")}</span>
                <span className="eventMonth">{format(new Date(event.date), "MMM")}</span>
                <span className="eventTime">{event.time}</span>
              </div>

              {/* Event Details */}
              <div className="eventDetails">
                <span className="eventTitle">{event.title}</span>
                <span className="eventLocation">{event.location}</span>
                <div className="view-event">
                  <span className="eventSeats">Seats Left: {event.availableSeats}</span>
                  <span className="eventView" onClick={() => navigate(`/event/${event.id}`)}>View</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
