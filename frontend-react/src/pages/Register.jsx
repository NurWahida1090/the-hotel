import "../assets/css/register.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Password dan konfirmasi password tidak sama");
            return;
        }
        if (password.length < 6) {
            alert("Password minimal 6 karakter");
            return;
        }
        setLoading(true);
        try {
            await registerUser({ username, email, password });
            alert("Registrasi berhasil! Silakan login.");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.detail || "Registrasi gagal. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="container">
                {/* LEFT - Decorative */}
                <div className="left">
                    <div className="left-inner">
                        <h1>Welcome !</h1>
                        <p>
                            Daftar sekarang untuk menikmati kemudahan
                            reservasi hotel premium, pelayanan prima,
                            dan pengalaman menginap tak terlupakan.
                        </p>
                    </div>
                </div>

                {/* RIGHT - Form */}
                <div className="right">
                    <h2>Register</h2>
                    <p>Buat akun gratis dan mulai reservasi kamar impian Anda</p>

                    <form onSubmit={handleRegister}>
                        <div className="input-box">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Masukkan email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box" style={{ marginBottom: 12 }}>
                            <label>Konfirmasi Password</label>
                            <input
                                type="password"
                                placeholder="Ulangi password Anda"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Mendaftar..." : "Register"}
                        </button>
                    </form>

                    <div className="bottom-text">
                        Sudah punya akun? <Link to="/login" className="register-link">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;