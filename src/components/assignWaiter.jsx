import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AssignWaiter = ({ eventId, tables, onUpdate }) => {
  const [staffList, setStaffList] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "staff"));
        const staffData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStaffList(staffData);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, []);

  const handleAssign = async (tableId, staffId) => {
    const eventRef = doc(db, "events", eventId);
    const updatedTables = tables.map(table =>
      table.id === tableId ? { ...table, assignedStaff: staffId } : table
    );

    try {
      await updateDoc(eventRef, { tables: updatedTables });
      setAssignments({ ...assignments, [tableId]: staffId });
      onUpdate(updatedTables);
      alert("Waiter assigned successfully!");
    } catch (error) {
      console.error("Error assigning waiter:", error);
    }
  };

  return (
    <div>
      <h2>Assign Waiters/Waitresses</h2>
      {tables.map(table => (
        <div key={table.id}>
          <p>Table {table.id} - Seats: {table.capacity}</p>
          <select
            value={assignments[table.id] || table.assignedStaff || ""}
            onChange={(e) => handleAssign(table.id, e.target.value)}
          >
            <option value="">Select Waiter</option>
            {staffList.map(staff => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.role})
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default AssignWaiter;
