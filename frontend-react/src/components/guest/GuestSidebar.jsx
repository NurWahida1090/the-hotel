import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiSearch, FiCalendar, FiStar, FiLogOut } from "react-icons/fi";

function GuestSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const navItems = [
        { to: "/dashboard",   icon: <FiHome />, label: "Dashboard"   },
        { to: "/kamar",       icon: <FiSearch />, label: "Cari Kamar"  },
        { to: "/reservasi",   icon: <FiCalendar />, label: "Reservasi Saya" },
        { to: "/review",      icon: <FiStar />, label: "Review Saya"  },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <aside className="guest-sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <div className="brand-text">
                        <span>The Hotel</span>
                        <span>{user.role ? `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal` : "Guest Portal"}</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <div className="sidebar-section-label">Menu</div>
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`guest-nav-link${location.pathname === item.to ? " active" : ""}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="sidebar-footer">
                <button className="sidebar-logout" onClick={handleLogout}>
                    <span className="nav-icon"><FiLogOut /></span>
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

export default GuestSidebar;
