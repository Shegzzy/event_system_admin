import "./eventList.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const EventList = ({ onEdit }) => {
  const [data, setData] = useState(userRows);
  const navigate = useNavigate();
  

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventData = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        console.log(eventData.id);
        setEvents(eventData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteDoc(doc(db, "events", eventId));
        setEvents(events.filter((event) => event.id !== eventId));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };
  
  const columns = [
    // { field: "docId", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      width: 200,
    },
    { field: "location", headerName: "Location", width: 200 },
    { field: "capacity", headerName: "Capacity", width: 200 },
    {
      field: "date",
      headerName: "Date",
      width: 120,
    },
    {
      field: "time",
      headerName: "Time",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="action_div">
            <Link to={`/events/${params.row.id}`} onClick={() => onEdit(params.row)}>
              <button className="eventListEdit">Edit</button>
            </Link>
    
            <Link to={`/user/${params.row.id}`}>
              <button className="eventListEdit">View</button>
            </Link>
    
            <DeleteOutline className="eventListDelete" onClick={() => handleDeleteEvent(params.row.docId)} />
          </div>
        );
      },
    }    
  ];

  return (
    <div className="eventList">
      <div className="featuredHeader">
        <h2 className="featuredTitle">Events</h2>
        <button className="viewAllBtn" onClick={() => navigate("/createEvent")}>Create Event</button>
      </div>

      <DataGrid
        rows={events}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}

export default EventList;
