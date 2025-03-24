import "../editEvent/editEvent.css";
import React, { useState } from "react";
import { db } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Form, InputGroup, Button } from "react-bootstrap";

const EditEvent = ({ event, onCancel, onUpdate }) => {
  const [id] = useState(event.docId);
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
      const eventRef = doc(db, "events", id);
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
      onCancel({event});
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editList">
      <h2>Edit Event</h2>

      <>
        
      <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            // handleChangePassword();
                        }}
                        id="verifyForm">
                        <Form.Group className="mb-3" controlId="formBasicEmail">


                            <Form.Label>Old Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    // type={showPassword ? 'text' : 'password'}
                                    // value={oldPassword}
                                    // onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder='enter old password'
                                    required
                                />
                                <Button variant="outline-secondary">
                                    
                                </Button>
                            </InputGroup>

                            <Form.Label>New Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    // type={showNewPassword ? 'text' : 'password'}
                                    // value={newPassword}
                                    // onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='enter new password'
                                    required
                                />
                                <Button variant="outline-secondary">
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Form>

        
      </>

      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
      <button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      {/* <button onClick={onCancel}>Cancel</button> */}
    </div>
  );
};

export default EditEvent;
