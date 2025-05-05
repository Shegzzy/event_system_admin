import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "./pages/login/login";

import Home from "./pages/home/Home";
import EventList from "./pages/eventList/EventList";
import EditEvent from "./components/editEvent/editEvent";
import CreateEvent from "./components/createEvent/createEvent";
import AttendeeList from "./pages/productList/AttendeeList";
import AdminQRScanner from "./components/qrcodeScanner/adminQRScanner";
import EventDetailsPage from "./components/eventDetails/eventDetails";
import AddAttendee from "./components/addAttendee/addAttendee";
import Layout from "./components/layout/layout";
import ProtectedRoute from "./context/protectedRoutes";

function App() {
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventData, setEventData] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route
            path="/events"
            element={<EventList onEdit={(event) => setEditingEvent(event)} />}
          />
          <Route
            path="/events/:eventId"
            element={
              <EditEvent
                event={editingEvent}
                onCancel={(event) => setEditingEvent(event)}
                onUpdate={(updatedEvent) => {
                  setEditingEvent(updatedEvent);
                }}
              />
            }
          />
          <Route
            path="/events/details/:eventId"
            element={
              <EventDetailsPage onAdd={(event) => setEventData(event)} />
            }
          />
          <Route
            path="/events/details/add_attendee"
            element={<AddAttendee eventData={eventData} />}
          />
          <Route path="/createEvent" element={<CreateEvent />} />
          <Route path="/attendees" element={<AttendeeList />} />
          <Route path="/scan" element={<AdminQRScanner />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
