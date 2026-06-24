import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiTrendingUp, FiCalendar, FiDatabase, FiAward, FiStar, FiLogOut } from "react-icons/fi";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };
    
    return (
        <div className="sidebar">
            <div className="logo">
                The Hotel
            </div>
            
            <div className="menu">
                <Link 
                    to="/admin/dashboard" 
                    className={location.pathname === "/admin/dashboard" ? "active" : ""}
                >
                    <span className="nav-icon"><FiTrendingUp /></span> Dashboard
                </Link>
                
                <Link 
                    to="/admin/reservasi"
                    className={location.pathname === "/admin/reservasi" ? "active" : ""}
                >
                    <span className="nav-icon"><FiCalendar /></span> Data Reservasi
                </Link>
                
                <Link 
                    to="/admin/kamar"
                    className={location.pathname === "/admin/kamar" ? "active" : ""}
                >
                    <span className="nav-icon"><FiDatabase /></span> Data Kamar
                </Link>
                
                <Link 
                    to="/admin/fasilitas"
                    className={location.pathname === "/admin/fasilitas" ? "active" : ""}
                >
                    <span className="nav-icon"><FiAward /></span> Data Fasilitas
                </Link>
                
                <Link 
                    to="/admin/review"
                    className={location.pathname === "/admin/review" ? "active" : ""}
                >
                    <span className="nav-icon"><FiStar /></span> Data Review
                </Link>
                
                 <Link to="#" onClick={handleLogout} style={{marginTop: "40px", color: "#fca5a5"}}>
                    <span className="nav-icon"><FiLogOut /></span> Logout
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;