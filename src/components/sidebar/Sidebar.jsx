import "./sidebar.css";
import {
  LineStyle,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  AdfScannerRounded,
  Scanner,
  QrCodeScanner,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import React, { useState } from "react";


export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("/");

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link" onClick={() => setActiveTab("/")}>
              <li className={`sidebarListItem ${activeTab === "/" ? "active" : ""}`}>
                <LineStyle className="sidebarIcon" />
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
                <Storefront className="sidebarIcon" />
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
          </ul>
        </div>
      </div>
    </div>
  );
}
