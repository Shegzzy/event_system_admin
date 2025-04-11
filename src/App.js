// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import AdminDashboard from "./pages/adminDashboard";
// import EventsList from './components/eventsList';
import Topbar from './components/topbar/Topbar';
import Sidebar from './components/sidebar/Sidebar';
import Home from './pages/home/Home';
import EventList from './pages/eventList/EventList';
// import User from './pages/user/User';
import React, { useState } from "react";
import EditEvent from './components/editEvent/editEvent';
import CreateEvent from './components/createEvent/createEvent';
import AttendeeList from './pages/productList/AttendeeList';
import AdminQRScanner from './components/qrcodeScanner/adminQRScanner';
import EventDetailsPage from './components/eventDetails/eventDetails';


function App() {
  const [editingEvent, setEditingEvent] = useState(null);
  
  return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route exact path="/" element = {<Home />} />
          <Route exact path="/events" element = {<EventList onEdit={(event) => setEditingEvent(event)}/>} />
          <Route exact path="/events/:eventId" element = {<EditEvent
            event={editingEvent}
            onCancel={(event) => setEditingEvent(event)}
            onUpdate={(updatedEvent) => {
              setEditingEvent(updatedEvent);}}/>} />
          <Route exact path="/events/details/:eventId" element = {<EventDetailsPage />} />
          <Route exact path="/createEvent" element = {<CreateEvent />} />
          <Route exact path="/attendees" element = {<AttendeeList />} />
          <Route exact path="/scan" element = {<AdminQRScanner />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
