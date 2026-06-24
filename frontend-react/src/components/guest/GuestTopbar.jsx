import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiEdit2, FiLogOut } from "react-icons/fi";
import { updateProfile } from "../../services/authService";

const pageMeta = {
    "/dashboard":   { title: "Dashboard",       subtitle: "Selamat datang kembali di The Hotel" },
    "/kamar":       { title: "Cari Kamar",       subtitle: "Temukan kamar yang sesuai untuk Anda" },
    "/reservasi":   { title: "Reservasi Saya",   subtitle: "Kelola booking dan reservasi Anda" },
    "/review":      { title: "Review Saya",      subtitle: "Bagikan pengalaman menginap Anda" },
};

function GuestTopbar() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // User state
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
    const initials = (user.username || "G").charAt(0).toUpperCase();

    const meta = pageMeta[location.pathname] || { title: "The Hotel", subtitle: "" };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam";

    // Dropdown and modal states
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    
    // Form fields
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Initialize form fields when opening modal
    const openEditProfile = () => {
        setUsername(user.username || "");
        setEmail(user.email || "");
        setPassword("");
        setDropdownOpen(false);
        setModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        if (!password) {
            alert("Harap masukkan password Anda untuk mengonfirmasi perubahan.");
            return;
        }

        setLoading(true);
        try {
            await updateProfile({ username, email, password });
            
            // If username has changed, they must re-login
            if (username !== user.username) {
                alert("Username berhasil diperbarui. Silakan masuk kembali dengan username baru Anda.");
                handleLogout();
            } else {
                // If only email (or password) changed, update user state
                const updatedUser = { ...user, email };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setModalOpen(false);
                alert("Profil berhasil diperbarui!");
            }
        } catch (err) {
            alert(err.response?.data?.detail || "Gagal memperbarui profil.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <header className="guest-topbar">
            <div className="topbar-left">
                <div className="page-title">{meta.title}</div>
                <div className="page-subtitle">{meta.subtitle}</div>
            </div>

            <div className="topbar-right">
                <div className="topbar-profile-container" ref={dropdownRef}>
                    <div 
                        className="topbar-profile-click" 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="topbar-greeting">
                            <div className="greeting-text">{greeting},</div>
                            <div className="user-name-top">{user.username || "Tamu"}</div>
                        </div>
                        <div className="topbar-avatar">{initials}</div>
                    </div>

                    {dropdownOpen && (
                        <div className="profile-dropdown">
                            <button className="profile-dropdown-item" onClick={openEditProfile}>
                                <FiEdit2 style={{ fontSize: "14px" }} /> Edit Profil
                            </button>
                            <button className="profile-dropdown-item logout" onClick={handleLogout}>
                                <FiLogOut style={{ fontSize: "14px" }} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {modalOpen && createPortal(
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Edit Profil</h3>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Username</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-input" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Password Konfirmasi</label>
                                    <input 
                                        type="password" 
                                        className="form-input" 
                                        placeholder="Masukkan password baru/lama"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                                        *Hashed password di database mewajibkan konfirmasi password Anda saat mengupdate profil.
                                    </span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? "Menyimpan..." : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </header>
    );
}

export default GuestTopbar;
