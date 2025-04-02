import "./attendeeList.css";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { collection, getDocs} from "firebase/firestore";
import { db } from "../../firebaseConfig";


export default function AttendeeList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "attendees"));
        const attendeeData = querySnapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));

        setData(attendeeData);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  const columns = [
    // { field: "userId", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },

    { field: "email", headerName: "Email", width: 200 },

    { field: "eventName", headerName: "Event Name", width: 200 },

    { field: "location", headerName: "Location", width: 200 },

    {
      field: "eventDate",
      headerName: "Event Date",
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <div>
                {params.value
              ? new Date(params.value).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
              : ""}
            </div>
          </>
        );
      },
    },

    {
      field: "timeStamp",
      headerName: "Date Signed Up",
      width: 160,
      renderCell: (params) => {
        return (
          <>
            <div>
                {params.value
              ? new Date(params.value.seconds * 1000).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
              : ""}
            </div>
          </>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
  ];

  return (
    <div className="productList">
      {loading ? (
        <p className="loadingContainer">Loading attendees...</p>
      ) : (
        <DataGrid
          getRowId={(row) => row.docId} 
          rows={data}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
        />
      )}
    </div>
  );
}
