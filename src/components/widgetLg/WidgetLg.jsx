import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import "./widgetLg.css";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";


export default function WidgetLg() {
  const [recentSignups, setRecentSignups] = useState([]);

  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };


    // Fetch Recent Signups
    useEffect(() => {
      const signupsRef = collection(db, "signups");
      const q = query(signupsRef, orderBy("timestamp", "desc"), limit(5));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setRecentSignups(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

      console.log(recentSignups.length);
      return () => unsubscribe();
    }, []);

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Attendees Signing Up</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Name</th>
          <th className="widgetLgTh">Event</th>
          <th className="widgetLgTh">Date</th>
          {/* <th className="widgetLgTh">Status</th> */}
        </tr>
        
        {recentSignups.length > 0 ? (<tbody>
          {recentSignups.map((signups) => (
            <tr className="widgetLgTr" key={signups.id}>
              <td className="widgetLgUser">
                <span className="widgetLgName">{signups.name}</span>
              </td>
              <td className="widgetLgDate">Wedding</td>
              <td className="widgetLgAmount">2 Jun 2021</td>
            </tr>
          ))}
        </tbody>) : (
            <p className="text-gray-500">No attendees registered yet.</p>
            )}
      </table>
    </div>
  );
}
