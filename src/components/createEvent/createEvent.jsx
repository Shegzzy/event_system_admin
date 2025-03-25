import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import "./createEvent.css";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [mealOptions, setMealOptions] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableCapacity, setTableCapacity] = useState("");
  const [loading, setLoading] = useState(false);

  // Add meal option
  const handleAddMealOption = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setMealOptions([...mealOptions, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  // Remove meal option
  const handleRemoveMealOption = (meal) => {
    setMealOptions(mealOptions.filter((m) => m !== meal));
  };

  // Add a table
  const handleAddTable = () => {
    if (!tableCapacity) return;
    const newTable = {
      id: `table_${tables.length + 1}`,
      capacity: parseInt(tableCapacity),
      availableSeats: parseInt(tableCapacity),
    };
    setTables([...tables, newTable]);
    setTableCapacity("");
  };

  // Remove a table
  const handleRemoveTable = (tableId) => {
    setTables(tables.filter((table) => table.id !== tableId));
  };

  // Create event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !time || !location || !capacity) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const eventId = `event_${uuidv4().slice(0, 8)}`;
      await addDoc(collection(db, "events"), {
        id: eventId,
        title,
        description,
        date,
        time,
        location,
        capacity: parseInt(capacity),
        availableSeats: parseInt(capacity),
        mealOptions,
        tables,
        createdBy: "admin_001",
        createdAt: serverTimestamp(),
      });

      alert("Event created successfully!");
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setLocation("");
      setCapacity("");
      setMealOptions([]);
      setTables([]);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleCreateEvent} className="event-form">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input type="number" placeholder="Total Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />

        {/* Meal Options */}
        {/* <div className="meal-options">
          <h4>Meal Options</h4>
          <input type="text" placeholder="Add meal (press Enter)" onKeyDown={handleAddMealOption} />
          <ul>
            {mealOptions.map((meal, index) => (
              <li key={index}>
                {meal}
                <button type="button" onClick={() => handleRemoveMealOption(meal)}>x</button>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Tables */}
        {/* <div className="table-section">
          <h4>Tables</h4>
          <div className="table-input">
            <input type="number" placeholder="Table Capacity" value={tableCapacity} onChange={(e) => setTableCapacity(e.target.value)} />
            <button type="button" onClick={handleAddTable}>Add Table</button>
          </div>
          <ul>
            {tables.map((table) => (
              <li key={table.id}>
                {table.id} - Capacity: {table.capacity}
                <button type="button" onClick={() => handleRemoveTable(table.id)}>x</button>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? <span className="loader"></span> : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
