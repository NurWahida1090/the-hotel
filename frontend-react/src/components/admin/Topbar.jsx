import { useState } from "react";

function Topbar() {
    const [search, setSearch] = useState("");
    
    // Parse user from local storage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const initials = (user.username || "A").charAt(0).toUpperCase();

    return (
        <div className="topbar">
            <div className="topbar-search">
                <input 
                    type="text" 
                    placeholder="Pencarian cepat..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="profile">
                <div className="profile-info" style={{ textAlign: "right" }}>
                    <h4>{user.username || "Admin Hotel"}</h4>
                    <small>Administrator</small>
                </div>
                <div style={{
                    width: "44px", height: "44px", borderRadius: "50%", 
                    background: "var(--sidebar-bg)", color: "white", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "600", fontSize: "16px"
                }}>
                    {initials}
                </div>
            </div>
        </div>
    );
}

export default Topbar;