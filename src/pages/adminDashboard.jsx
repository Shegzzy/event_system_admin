import React, { useState } from "react";
import EventsList from "../components/eventsList";
import CreateEvent from "../components/createEvent/createEvent";
import AttendeesList from "../components/attendeesList";
import EditEvent from "../components/editEvent/editEvent";
import AdminQRScanner from "../components/qrcodeScanner/adminQRScanner";
import DashboardHome from "./home";
// import AssignWaiters from "../components/AssignWaiters";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [editingEvent, setEditingEvent] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <nav className="flex flex-col space-y-2">
          <button
            className={`py-2 px-4 rounded-md transition ${
              activeTab === "home" ? "bg-white text-blue-600" : "hover:bg-blue-500"
            }`}
            onClick={() => { setActiveTab("home"); setEditingEvent(null); }}
          >
            Dashboard
          </button>

          <button
            className={`py-2 px-4 rounded-md transition ${
              activeTab === "events" ? "bg-white text-blue-600" : "hover:bg-blue-500"
            }`}
            onClick={() => { setActiveTab("events"); setEditingEvent(null); }}
          >
            Manage Events
          </button>
          <button
            className={`py-2 px-4 rounded-md transition ${
              activeTab === "createEvent" ? "bg-white text-blue-600" : "hover:bg-blue-500"
            }`}
            onClick={() => { setActiveTab("createEvent"); setEditingEvent(null); }}
          >
            Create Event
          </button>
          <button
            className={`py-2 px-4 rounded-md transition ${
              activeTab === "attendees" ? "bg-white text-blue-600" : "hover:bg-blue-500"
            }`}
            onClick={() => setActiveTab("attendees")}
          >
            View Attendees
          </button>
          <button
            className={`py-2 px-4 rounded-md transition ${
              activeTab === "adminScanner" ? "bg-white text-blue-600" : "hover:bg-blue-500"
            }`}
            onClick={() => setActiveTab("adminScanner")}
          >
            Scan QR Code
          </button>
          {/* <button onClick={() => setActiveTab("waiters")}>Assign Waiters</button> */}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {editingEvent ? (
          <EditEvent
            event={editingEvent}
            onCancel={() => setEditingEvent(null)}
            onUpdate={(updatedEvent) => {
              setEditingEvent(null);
              setActiveTab("events");
            }}
          />
        ) : (
          <>
            {activeTab === "home" && <DashboardHome />}
            {activeTab === "events" && <EventsList onEdit={(event) => setEditingEvent(event)} />}
            {activeTab === "attendees" && <AttendeesList />}
            {/* {activeTab === "waiters" && <AssignWaiters />} */}
            {activeTab === "createEvent" && <CreateEvent />}
            {activeTab === "adminScanner" && <AdminQRScanner />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
