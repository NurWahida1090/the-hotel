import { useLocation } from "react-router-dom";

const pageMeta = {
    "/dashboard":   { title: "Dashboard",       subtitle: "Selamat datang kembali di The Hotel" },
    "/kamar":       { title: "Cari Kamar",       subtitle: "Temukan kamar yang sesuai untuk Anda" },
    "/reservasi":   { title: "Reservasi Saya",   subtitle: "Kelola booking dan reservasi Anda" },
    "/review":      { title: "Review Saya",      subtitle: "Bagikan pengalaman menginap Anda" },
};

function GuestTopbar() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const initials = (user.username || "G").charAt(0).toUpperCase();

    const meta = pageMeta[location.pathname] || { title: "The Hotel", subtitle: "" };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

    return (
        <header className="guest-topbar">
            <div className="topbar-left">
                <div className="page-title">{meta.title}</div>
                <div className="page-subtitle">{meta.subtitle}</div>
            </div>

            <div className="topbar-right">
                <div className="topbar-greeting">
                    <div className="greeting-text">{greeting},</div>
                    <div className="user-name-top">{user.username || "Tamu"}</div>
                </div>
                <div className="topbar-avatar">{initials}</div>
            </div>
        </header>
    );
}

export default GuestTopbar;
