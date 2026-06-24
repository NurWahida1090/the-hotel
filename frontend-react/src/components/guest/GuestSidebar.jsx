import { Link, useLocation, useNavigate } from "react-router-dom";

function GuestSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
        window.dispatchEvent(new Event("open-profile-modal"));
    };

    return (
        <aside className="guest-sidebar">
            {/* Brand */}
            <div className="sidebar-brand">
                <div className="brand-logo">
                    <span className="brand-title-text">The Hotel</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <Link
                    to="/dashboard"
                    className={`guest-nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/reservasi"
                    className={`guest-nav-link ${location.pathname === "/reservasi" ? "active" : ""}`}
                >
                    Reservasi Saya
                </Link>
                <Link
                    to="/kamar"
                    className={`guest-nav-link ${location.pathname === "/kamar" ? "active" : ""}`}
                >
                    Daftar Kamar
                </Link>
                <Link
                    to="/review"
                    className={`guest-nav-link ${location.pathname === "/review" ? "active" : ""}`}
                >
                    Profile & Review
                </Link>
                <button
                    onClick={handleLogout}
                    className="guest-nav-link-btn logout-btn"
                >
                    Logout
                </button>
            </nav>
        </aside>
    );
}

export default GuestSidebar;
