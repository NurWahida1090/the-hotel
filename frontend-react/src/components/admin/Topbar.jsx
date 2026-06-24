import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { FiEdit2, FiLogOut } from "react-icons/fi";
import { updateProfile } from "../../services/authService";

function Topbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    
    // Parse user from local storage
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
    const initials = (user.username || "A").charAt(0).toUpperCase();

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
        <div className="topbar">
            <div className="topbar-search">
                <input 
                    type="text" 
                    placeholder="Pencarian cepat..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="profile-container" ref={dropdownRef}>
                <div 
                    className="profile" 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ userSelect: "none" }}
                >
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

            {/* Edit Profile Modal */}
            {modalOpen && createPortal(
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Edit Profil Admin</h3>
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
                                    <span style={{ fontSize: "11px", color: "#64748b" }}>
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
        </div>
    );
}

export default Topbar;