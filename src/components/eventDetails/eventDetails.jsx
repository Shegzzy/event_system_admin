import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { doc, getDoc, collection, query, where, serverTimestamp, setDoc, onSnapshot } from "firebase/firestore";
import "./eventDetails.css";
import { QRCodeCanvas } from 'qrcode.react';
// import { v4 as uuidv4 } from 'uuid';
// import emailjs from '@emailjs/browser';
import ShortUniqueId from "short-unique-id";


const EventDetailsPage = ({ onAdd }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setChekingIn] = useState(false);
  const [sendingTicket, setSendingTicket] = useState(false);
  const canvasRef = useRef(null);
  const [qrCode, setqrCode] = useState('');
  const navigate = useNavigate();
  // const [imageData, setImageData] = useState(null);


  const uid = new ShortUniqueId({ length: 10 });

  const generateQrCode = async (email, id) => {

    setSendingTicket((prev) => ({ ...prev, [id]: true }));

    try {
      const uniqueId = uid.rnd();
      setqrCode(uniqueId);

      setTimeout(async () => {
        if (canvasRef.current) {
          const imgData = canvasRef.current.toDataURL('image/png');

          await sendTicketEmail(email, uniqueId, imgData, id);
        }

        setSendingTicket((prev) => ({ ...prev, [id]: false }));
      }, 200);
    } catch (err) {
      console.log(err);
    }

  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Event Details
        const eventRef = doc(db, "events", eventId);
        const eventSnap = await getDoc(eventRef);
        if (eventSnap.exists()) {
          setEvent(eventSnap.data());
        } else {
          console.error("Event not found!");
        }

        // Fetch Attendees
        const signupsQuery = query(
          collection(db, "attendees"),
          where("eventId", "==", eventId)
        );

        const unsubscribe = onSnapshot(signupsQuery, (snapshot) => {
          setAttendees(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribePromise = fetchData();

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === "function") unsubscribe();
      });
    };
  }, [eventId]);

  // const sendEmail = async (email, imgData, uniqueId, id) => {

  //   const serviceId = process.env.REACT_APP_EMAIL_SERVICE_ID || '';
  //   const templateId = process.env.REACT_APP_EMAIL_TEMPLATE_ID || '';
  //   const publicKey = process.env.REACT_APP_EMAIL_PUBLIC_KEY;

  //   console.log(imgData);

  //   const emailTemplate = {
  //     image_url: imgData,
  //     name: event.title,
  //     email: email,
  //     speaker: event.speaker,
  //     date: event.date,
  //     time: event.time,
  //     location: event.location,
  //   };

  //   try {
  //     const response = await emailjs.send(serviceId, templateId, emailTemplate, publicKey);
  //     if (response.status === 200) {
  //       await updateUserTicket(uniqueId, imgData, id);
  //       alert(`Event ticket has been sent to ${email}`);
  //       console.log('Email sent successfully');
  //     }
  //   } catch (error) {
  //     // showAlert({ type: 'error', text: 'Failed to send email' });
  //     alert('Error sending event ticket');
  //     console.log('Email sending error:', error);
  //   }
  // };

  const sendTicketEmail = async (email, qrCode, imgData, id) => {

    try {

      const res = await fetch("https://arialuxe-email-backend.vercel.app/api/nnc-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          eventName: event.title,
          eventDate: event.date,
          time: event.time,
          location: event.location,
          speaker: event.speaker,
          qrCodeUrl: qrCode
        }),
      });

      const data = await res.json();
      console.log(data);
      if (res.status === 200) {
        await updateUserTicket(qrCode, imgData, id);
        alert(`Event ticket has been sent to ${email}`);
        console.log('Email sent successfully');
      } else {
        alert('Error sending event ticket');
        console.error('Email sending error:', data.message);
      }

    } catch (error) {
      alert('Error sending event ticket');
      console.log('Email sending error:', error);
    } finally {
      setSendingTicket(false);
    }

  };


  const updateUserTicket = async (qrCode, imgData, id) => {

    const attendeeData = {
      status: 'not checked in',
      eventQr: qrCode,
      qrImage: imgData,
      timeStamp: serverTimestamp(),
    };

    await setDoc(doc(db, 'attendees', id), attendeeData, { merge: true });
  };

  const handleCheckIn = async (name, id) => {
    setChekingIn((prev) => ({ ...prev, [id]: true }));
    try {
      const guestRef = doc(db, "attendees", id);

      await setDoc(guestRef, { status: "checked in" }, { merge: true });

      alert(`${name} has been checked in!`);
    } catch (err) {
      console.error(err);
    } finally {
      setChekingIn((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="event-details-container">
      {loading ? (
        <p className="loadingContainer">Loading...</p>
      ) : event ? (
        <>
          <div className="event-details-container">
            <h2 className="event-title">Event Details</h2>
            <div className="event-details-grid">
              <div className="event-item">
                <span className="label">Event Title:</span>
                <span className="value">{event.title}</span>
              </div>
              <div className="event-item">
                <span className="label">Speaker:</span>
                <span className="value">{event.speaker}</span>
              </div>
              <div className="event-item">
                <span className="label">Description:</span>
                <span className="value">{event.description}</span>
              </div>
              <div className="event-item">
                <span className="label">Location:</span>
                <span className="value">{event.location}</span>
              </div>
              <div className="event-item">
                <span className="label">Date:</span>
                <span className="value">{new Date(event.date).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}</span>
              </div>

              <div className="event-item">
                <span className="label">Time:</span>
                <span className="value">{event.time}</span>
              </div>

              <div className="event-item">
                <span className="label">Created On:</span>
                <span className="value">{new Date(event.createdAt.seconds * 1000).toLocaleString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}</span>
              </div>

              <div className="event-item event-status">
                <span className="label">Event Status:</span>
                <label className="switch">
                  <input type="checkbox" checked={event.status === "Active"} readOnly />
                  <span className="slider"></span>
                </label>
                <span className="value">{event.status}</span>
              </div>
            </div>
          </div>

          <h2>Attendees List</h2>
          <button className="viewAllBtn" onClick={() => {
            onAdd(event);
            navigate("/events/details/add_attendee")
          }}>Add</button>

          {attendees.length === 0 ? (
            <p>No attendees have signed up yet.</p>
          ) : (
            <table className="attendees-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((attendee, index) => (
                  <tr key={attendee.id}>
                    <td>{index + 1}</td>
                    <td>{attendee.name}</td>
                    <td>{attendee.email}</td>
                    <td>{attendee.eventQr}</td>
                    <td>{attendee.status}</td>
                    <td>{attendee.timeStamp?.seconds ? new Date(attendee.timeStamp.seconds * 1000).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    }) : '_'}
                    </td>
                    <td>
                      {attendee.eventQr === '' &&
                        (<button onClick={() => generateQrCode(attendee.email, attendee.id)} disabled={sendingTicket[attendee.id]}>
                          {sendingTicket[attendee.id] ? <span className="loader"></span> : "Send Ticket"}
                        </button>)}
                      <span>      </span>
                      {attendee.status === 'not checked in' && attendee.eventQr !== '' &&
                        (<button onClick={() => handleCheckIn(attendee.name, attendee.id)} disabled={checkingIn[attendee.id]}>
                          {checkingIn[attendee.id] ? <span className="loader"></span> : "Check In"}
                        </button>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className='container center'>
            <QRCodeCanvas
              value={qrCode}
              size={150}
              ref={canvasRef}
              level='H'
              bgColor='white'
              style={{ display: 'none' }}
            />
          </div>
        </>
      ) : (
        <p>Event not found!</p>
      )}
    </div>
  );
};

export default EventDetailsPage;
