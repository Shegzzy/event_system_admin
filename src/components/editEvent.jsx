import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const EditEvent = ({ event, onCancel, onUpdate }) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [location, setLocation] = useState(event.location);
  const [capacity, setCapacity] = useState(event.capacity);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, {
        title,
        description,
        date,
        time,
        location,
        capacity: parseInt(capacity),
      });
      onUpdate({ ...event, title, description, date, time, location, capacity: parseInt(capacity) });
      alert("Event updated successfully!");
      onCancel();
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Edit Event</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
      <button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default EditEvent;
