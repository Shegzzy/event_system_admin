import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import "./eventDetails.css";

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Event Details
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          setEvent(eventSnap.data());
        } else {
          console.error("Event not found!");
        }

        // Fetch Attendees
        const signupsQuery = query(
          collection(db, "attendees"),
          where("eventId", "==", eventId)
        );
        const signupsSnap = await getDocs(signupsQuery);
        const attendeesList = signupsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAttendees(attendeesList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Ensure loading is disabled only after both fetches are complete
      }
    };

    fetchData();
  }, [eventId]);

  return (
    <div className="event-details-container">
      {loading ? (
        <p className="loadingContainer">Loading...</p>
      ) : event ? (
        <>
            <div className="event-details-container">
                <h2 className="event-title">Event Details</h2>
                <div className="event-details-grid">
                    <div className="event-item">
                    <span className="label">Event Title:</span>
                    <span className="value">{event.title}</span>
                    </div>
                    <div className="event-item">
                    <span className="label">Speaker:</span>
                    <span className="value">{event.speaker}</span>
                    </div>
                    <div className="event-item">
                    <span className="label">Description:</span>
                    <span className="value">{event.description}</span>
                    </div>
                    <div className="event-item">
                    <span className="label">Location:</span>
                    <span className="value">{event.location}</span>
                    </div>
                    <div className="event-item">
                    <span className="label">Date:</span>
                    <span className="value">{new Date(event.date).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        })}</span>
                    </div>

                    <div className="event-item">
                    <span className="label">Time:</span>
                    <span className="value">{event.time}</span>
                    </div>
                    
                    <div className="event-item">
                    <span className="label">Created On:</span>
                    <span className="value">{new Date(event.createdAt.seconds * 1000).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        })}</span>
                    </div>

                    <div className="event-item event-status">
                    <span className="label">Event Status:</span>
                    <label className="switch">
                        <input type="checkbox" checked={event.status === "Active"} readOnly />
                        <span className="slider"></span>
                    </label>
                    <span className="value">{event.status}</span>
                    </div>
                </div>
            </div>

          <h2>Attendees List</h2>
          {attendees.length === 0 ? (
            <p>No attendees have signed up yet.</p>
          ) : (
            <table className="attendees-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee, index) => (
                  <tr key={attendee.id}>
                    <td>{index + 1}</td>
                    <td>{attendee.name}</td>
                    <td>{attendee.email}</td>
                    <td>{attendee.status}</td>
                    <td>{new Date(attendee.timeStamp.seconds * 1000).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <p>Event not found!</p>
      )}
    </div>
  );
};

export default EventDetailsPage;
