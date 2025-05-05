// components/Layout.js
// import Topbar from "./components/topbar/Topbar";
import Topbar from "../topbar/Topbar";
import Sidebar from "../sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Topbar />
            <div className="container">
                <Sidebar />
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
