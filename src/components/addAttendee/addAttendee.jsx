import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../../firebaseConfig';

function AddAttendee ({eventData}) {
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [loading, setLoading] = useState(false);
      
      const handleAdd = async (e) => {
        e.preventDefault();
        if (!name || !email) {
          alert("Please fill all fields");
          return;
        }
    
        // Check if the user is already registered for the event
        const isAlreadyRegistered = await checkIfAlreadyRegistered(email, eventData.id);

        if (isAlreadyRegistered) {
          alert('Attendee is already registered for this event.');
          return;
        }
    
        setLoading(true);

        try {
          const attendeeData = {
            eventName: eventData.title,
            eventSpeaker: eventData.speaker,
            eventId: eventData.id,
            eventDate: eventData.date,
            eventTime: eventData.time,
            location: eventData.location,
            name: name,
            email: email,
            status: 'not checked in',
            eventQr: '',
            qrImage: '',
            timeStamp: serverTimestamp(),
            };
        
            const docRef = await addDoc(collection(db, 'attendees'), attendeeData);
        
            await setDoc(doc(db, 'attendees', docRef.id), { id: docRef.id, userId: docRef.id, }, { merge: true });
    
            alert("Attendee added successfully!");
            setName("");
            setEmail("");

        } catch (error) {
            console.error("Error adding attendee:", error);
            alert("Failed to register for the event.");
        } finally {
            setLoading(false);
        }

      };
    
      // Function to check if the user is already registered
      const checkIfAlreadyRegistered = async (userId, eventId) => {
        const attendeesRef = collection(db, 'attendees');
        const q = query(attendeesRef, where('email', '==', email), where('eventId', '==', eventId));
    
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.length > 0;
      };

    return (
        <div className="event-container">
          <h2>Add Attendee</h2>
          <form onSubmit={handleAdd} className="event-form">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
    
            {/* Submit Button */}
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? <span className="loader"></span> : "Add"}
            </button>
          </form>
        </div>
      );
}

export default AddAttendee 