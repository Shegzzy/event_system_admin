import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import "./widgetLg.css";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";


export default function WidgetLg() {
  const [recentSignups, setRecentSignups] = useState([]);

  // const Button = ({ type }) => {
  //   return <button className={"widgetLgButton " + type}>{type}</button>;
  // };


    // Fetch Recent Signups
    useEffect(() => {
      const signupsRef = collection(db, "attendees");
      const q = query(signupsRef, orderBy("timeStamp", "desc"), limit(5));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setRecentSignups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }, []);

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Attendees Signing Up</h3>
      <table className="widgetLgTable">
            <thead>
              <tr className="widgetLgTr">
                <th className="widgetLgTh"></th>
                <th className="widgetLgTh">Name</th>
                <th className="widgetLgTh">Event Name</th>
                <th className="widgetLgTh">Event Date</th>
                <th className="widgetLgTh">Location</th>
                <th className="widgetLgTh">Date Signed Up</th>
                <th className="widgetLgTh">Status</th>
              </tr>
            </thead>
        
        {recentSignups.length > 0 ? (<tbody>
          {recentSignups.map((signups, index) => (
            <tr className="widgetLgTr" key={signups.id}>
              <td className="widgetLgName">{index + 1}</td>

              <td className="widgetLgUser">
                <span className="widgetLgName">{signups.name}</span>
              </td>
              <td className="widgetLgName">{signups.eventName}</td>
              <td className="widgetLgName">{signups.eventDate}</td>
              <td className="widgetLgName">{signups.location}</td>
              <td className="widgetLgName">{ new Date(signups.timeStamp.seconds * 1000).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="widgetLgName">{signups.status}</td>
            </tr>
          ))}
        </tbody>) : (
            <p className="text-gray-500">No attendees registered yet.</p>
            )}
      </table>
    </div>
  );
}
