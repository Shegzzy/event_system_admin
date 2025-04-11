import "./editEvent.css";
import React, { useState } from "react";
import { db, storage } from "../../firebaseConfig";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";

const EditEvent = ({ event, onCancel, onUpdate }) => {
  const { eventId } = useParams();
  const [title, setTitle] = useState(event.title);
  const [speaker, setSpeaker] = useState(event.speaker);
  const [description, setDescription] = useState(event.description);
  const [date, setStartDate] = useState(event.date);
  const [endDate, setEndDate] = useState(event.endDate);
  const [time, setStartTime] = useState(event.time);
  const [endTime, setEndTime] = useState(event.endTime);
  const [location, setLocation] = useState(event.location);
  const [capacity, setCapacity] = useState(event.capacity);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(event.image); // Show existing image

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview selected image
    }
  };

  // Upload image to Firebase Storage and return the URL
  const uploadImage = async (imageFile) => {
    const storageRef = ref(storage, `event_images/${eventId}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Handle save
  const handleSave = async () => {
    setLoading(true);
    let imageUrl = previewImage;
  
    try {
      if (image) {
        imageUrl = await uploadImage(image);
      }
  
      // Update the main event
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        title,
        speaker,
        description,
        date,
        endDate,
        time,
        endTime,
        location,
        capacity: parseInt(capacity),
        image: imageUrl,
      });
  
      // Update relevant fields in attendee docs
      const attendeesQuery = query(collection(db, "attendees"), where("eventId", "==", eventId));
      const attendeesSnapshot = await getDocs(attendeesQuery);
  
      const updateData = {
        eventName: title,
        eventSpeaker: speaker,
        eventDate: date,
        eventTime: time,
        location,
      };
  
      const batchUpdates = attendeesSnapshot.docs.map((attendeeDoc) => {
        const attendeeRef = attendeeDoc.ref;
        return updateDoc(attendeeRef, updateData);
      });
  
      await Promise.all(batchUpdates);
  
      onUpdate({
        ...event,
        title,
        speaker,
        description,
        date,
        endDate,
        time,
        endTime,
        location,
        capacity: parseInt(capacity),
        image: imageUrl,
      });
  
      alert("Event and attendee records updated!");
    } catch (error) {
      console.error("Error updating event or attendees:", error);
      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="editList">
      <h2>Edit Event</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Speaker" value={speaker} onChange={(e) => setSpeaker(e.target.value)} required />
      <textarea value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} required></textarea>
      <input type="date" placeholder="Start Date" value={date} onChange={(e) => setStartDate(e.target.value)} required />
      <input type="date" placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)}  />
      <input type="time" placeholder="Start Time" value={time} onChange={(e) => setStartTime(e.target.value)} required />
      <input type="time" placeholder="End Time" value={endTime} onChange={(e) => setEndTime(e.target.value)}  />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input type="number" placeholder="Audience Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />

      {/* Image Upload Section */}
      {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
      
      {/* Show Image Preview */}
      {previewImage && (
        <div className="image-preview">
          <img src={previewImage} alt="Event Preview" className="image-preview-img" />
        </div>
      )}

      <button onClick={handleSave} disabled={loading} className="submit-btn">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default EditEvent;
