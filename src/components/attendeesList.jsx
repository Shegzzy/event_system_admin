import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const AttendeesList = () => {
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      const attendeesCollection = await getDocs(collection(db, "attendees"));
      setAttendees(attendeesCollection.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchAttendees();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Registered Attendees</h2>
      
      {attendees.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee) => (
              <tr key={attendee.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{attendee.name}</td>
                <td className="border border-gray-300 px-4 py-2">{attendee.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">No attendees registered yet.</p>
      )}
    </div>
  );
};

export default AttendeesList;
