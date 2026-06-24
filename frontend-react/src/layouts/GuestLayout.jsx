import "../assets/css/guest.css";
import GuestSidebar from "../components/guest/GuestSidebar";
import GuestTopbar from "../components/guest/GuestTopbar";

function GuestLayout({ children }) {
    return (
        <div className="guest-layout">
            <GuestSidebar />
            <div className="guest-main">
                <GuestTopbar />
                <main className="guest-content">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default GuestLayout;
