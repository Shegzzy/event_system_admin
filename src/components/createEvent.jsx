import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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

  const handleAddMealOption = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      setMealOptions([...mealOptions, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleRemoveMealOption = (meal) => {
    setMealOptions(mealOptions.filter((m) => m !== meal));
  };

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

  const handleRemoveTable = (tableId) => {
    setTables(tables.filter((table) => table.id !== tableId));
  };

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
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Create New Event</h2>
      <form onSubmit={handleCreateEvent} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="number"
          placeholder="Total Capacity"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="w-full p-2 border rounded-md"
          required
        />

        <div>
          <h4 className="font-semibold mb-2">Meal Options</h4>
          <input
            type="text"
            placeholder="Add meal (press Enter)"
            onKeyDown={handleAddMealOption}
            className="w-full p-2 border rounded-md"
          />
          <ul className="mt-2 space-y-1">
            {mealOptions.map((meal, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                {meal}
                <button
                  type="button"
                  onClick={() => handleRemoveMealOption(meal)}
                  className="text-red-500 font-bold"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Tables</h4>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Table Capacity"
              value={tableCapacity}
              onChange={(e) => setTableCapacity(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <button
              type="button"
              onClick={handleAddTable}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add Table
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {tables.map((table) => (
              <li key={table.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                {table.id} - Capacity: {table.capacity}
                <button
                  type="button"
                  onClick={() => handleRemoveTable(table.id)}
                  className="text-red-500 font-bold"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-md text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
          }`}
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
