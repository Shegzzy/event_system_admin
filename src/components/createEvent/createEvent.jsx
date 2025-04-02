import React, { useState } from "react";
import { db, storage } from "../../firebaseConfig";
import { collection, addDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "./createEvent.css";

const CreateEvent = () => {
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [mealOptions, setMealOptions] = useState([]);
  const [tables, setTables] = useState([]);
  const [tableCapacity, setTableCapacity] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

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

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Create a preview URL for the selected image
    }
  };

  // Upload image to Firebase Storage and return URL
  const uploadImage = async (image) => {
    const storageRef = ref(storage, `event_images/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can handle progress if needed
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL))
            .catch((error) => reject(error));
        }
      );
    });
  };


  // Create event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title || !speaker || !description || !date || !time || !location || !capacity) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    let imageUrl = "";
    if (image) {
      try {
        imageUrl = await uploadImage(image);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image.");
        setLoading(false);
        return;
      }
    }

    try {

      const docRef = await addDoc(collection(db, "events"), {
        title,
        speaker,
        description,
        date,
        endDate,
        time,
        endTime,
        location,
        capacity: parseInt(capacity),
        availableSeats: parseInt(capacity),
        mealOptions,
        tables,
        image: imageUrl,
        createdBy: "admin_001",
        createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "events", docRef.id), { id: docRef.id }, { merge: true });


      alert("Event created successfully!");
      setTitle("");
      setSpeaker("");
      setDescription("");
      setDate("");
      setEndDate("");
      setTime("");
      setEndTime("");
      setLocation("");
      setCapacity("");
      setMealOptions([]);
      setTables([]);
      setImage(null);
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
        <input type="text" placeholder="Speaker" value={speaker} onChange={(e) => setSpeaker(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="date" placeholder="Start Date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setDate(e.target.value)} />
        <input type="time" placeholder="Start Time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <input type="time" placeholder="End Time" value={endTime} onChange={(e) => setTime(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <input type="number" placeholder="Audience Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        
        {/* Image Preview */}
        {image && (
          <div className="image-preview">
            <img src={image} alt="Selected Event" className="image-preview-img" />
          </div>
        )}

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
