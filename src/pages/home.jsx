import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentSignups, setRecentSignups] = useState([]);
  const navigate = useNavigate();

  // Fetch Upcoming Events
  useEffect(() => {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("date"), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUpcomingEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fetch Recent Signups
  useEffect(() => {
    const signupsRef = collection(db, "signups");
    const q = query(signupsRef, orderBy("timestamp", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecentSignups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Upcoming Events Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-gray-600">{event.date} - {event.location}</p>
              <p className="text-gray-500">Seats Left: {event.availableSeats}</p>
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/events")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          View All Events
        </button>
      </div>

      {/* Recent Sign-ups Table */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Sign-ups</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">User Name</th>
              <th className="p-2 border">Event Name</th>
              <th className="p-2 border">Event Date</th>
              <th className="p-2 border">Location</th>
            </tr>
          </thead>
          {recentSignups.length > 0 ? (<tbody>
            {recentSignups.map((signup) => (
              <tr key={signup.id} className="text-center border">
                <td className="p-2 border">{signup.userName}</td>
                <td className="p-2 border">{signup.eventName}</td>
                <td className="p-2 border">{signup.eventDate}</td>
                <td className="p-2 border">{signup.eventLocation}</td>
              </tr>
            ))}
          </tbody>) : (
            <p className="text-gray-500">No attendees registered yet.</p>
            )}
        </table>
      </div>
    </div>
  );
};

export default DashboardHome;
