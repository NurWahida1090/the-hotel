import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();
    
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
                    <span style={{fontSize: "18px"}}>📊</span> Dashboard
                </Link>
                
                <Link 
                    to="/admin/reservasi"
                    className={location.pathname === "/admin/reservasi" ? "active" : ""}
                >
                    <span style={{fontSize: "18px"}}>📋</span> Data Reservasi
                </Link>
                
                <Link 
                    to="/admin/kamar"
                    className={location.pathname === "/admin/kamar" ? "active" : ""}
                >
                    <span style={{fontSize: "18px"}}>🛏️</span> Data Kamar
                </Link>
                
                <Link 
                    to="/admin/fasilitas"
                    className={location.pathname === "/admin/fasilitas" ? "active" : ""}
                >
                    <span style={{fontSize: "18px"}}>✨</span> Data Fasilitas
                </Link>
                
                <Link 
                    to="/admin/review"
                    className={location.pathname === "/admin/review" ? "active" : ""}
                >
                    <span style={{fontSize: "18px"}}>⭐</span> Data Review
                </Link>
                
                <Link to="/" style={{marginTop: "40px", color: "#fca5a5"}}>
                    <span style={{fontSize: "18px"}}>🚪</span> Logout
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;