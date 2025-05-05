import "./sidebar.css";
import {
  // LineStyle,
  PermIdentity,
  // Storefront,
  // AttachMoney,
  // BarChart,
  // AdfScannerRounded,
  // Scanner,
  QrCodeScanner,
  // Home,
  // Event,
  // EventSharp,
  EventAvailable,
  HomeRounded,
  Logout,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { AuthContext } from "../../context/authContext";
import { auth } from "../../firebaseConfig";
import { useContext } from "react";
import { IconButton } from "@mui/material";


export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("/");
  const { dispatch } = useContext(AuthContext);


  const logout = async () => {
    try {
      await auth.signOut();
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link" onClick={() => setActiveTab("/")}>
              <li className={`sidebarListItem ${activeTab === "/" ? "active" : ""}`}>
                <HomeRounded className="sidebarIcon" />
                Home
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">

            <Link to="/events" className="link" onClick={() => setActiveTab("events")}>
              <li className={`sidebarListItem ${activeTab === "events" ? "active" : ""}`}>
                <EventAvailable className="sidebarIcon" />
                Events
              </li>
            </Link>

            <Link to="/attendees" className="link" onClick={() => setActiveTab("attendees")}>
              <li className={`sidebarListItem ${activeTab === "attendees" ? "active" : ""}`}>
                <PermIdentity className="sidebarIcon" />
                Attendees
              </li>
            </Link>

            <Link to="/scan" className="link" onClick={() => setActiveTab("scan")}>
              <li className={`sidebarListItem ${activeTab === "scan" ? "active" : ""}`}>
                <QrCodeScanner className="sidebarIcon" />
                Scan Code
              </li>
            </Link>

            <IconButton onClick={logout} sx={{ fontSize: "1rem" }}>
              <Logout className="sidebarIcon" />
              Logout
            </IconButton>

          </ul>
        </div>
      </div>
    </div>
  );
}
