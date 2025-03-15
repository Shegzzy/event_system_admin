import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Switch} from "react-router-dom";
import AdminDashboard from "./pages/adminDashboard";
import EventsList from './components/eventsList';
import Topbar from './components/topbar/Topbar';
import Sidebar from './components/sidebar/Sidebar';
import Home from './pages/home/Home';
import UserList from './pages/userList/UserList';
import User from './pages/user/User';

function App() {
  return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Routes>
          <Route exact path="/" element = {<Home />} />
          <Route exact path="/users" element = {<UserList />} />
          <Route exact path="/user/:userId" element = {<User />} />
        </Routes>
      </div>

      {/* 
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/events" element={<EventsList />} />
      </Routes> 
      */}
    </Router>
  );
}

export default App;
