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
                {/* LEFT - Form */}
                <div className="left">
                    <div className="left-logo">The Hotel · Buat Akun</div>
                    <h2>Daftar Sekarang</h2>
                    <p>Buat akun gratis dan mulai reservasi kamar impian Anda</p>

                    <form onSubmit={handleRegister}>
                        <div className="input-box">
                            <label>Username</label>
                            <input
                                type="text"
                                placeholder="Buat username unik..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Alamat email Anda..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Minimal 6 karakter..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box">
                            <label>Konfirmasi Password</label>
                            <input
                                type="password"
                                placeholder="Ulangi password Anda..."
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Mendaftar..." : "Daftar Sekarang →"}
                        </button>
                    </form>

                    <div className="bottom-text">
                        Sudah punya akun?
                        <Link to="/login">Masuk</Link>
                    </div>

                    <div style={{ textAlign: "center", marginTop: 16 }}>
                        <Link to="/" style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none" }}>
                            ← Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>

                {/* RIGHT - Decorative */}
                <div className="right">
                    <div className="right-inner">
                        <div className="right-badge">
                            The Hotel
                        </div>
                        <h1>Bergabung Bersama Kami</h1>
                        <p>
                            Nikmati kemudahan reservasi hotel premium
                            langsung dari genggaman Anda.
                        </p>
                        <div className="right-steps">
                            <div className="right-step">
                                <div className="step-number">1</div>
                                <div className="step-info">
                                    <h4>Buat Akun</h4>
                                    <p>Daftar gratis dalam hitungan detik</p>
                                </div>
                            </div>
                            <div className="right-step">
                                <div className="step-number">2</div>
                                <div className="step-info">
                                    <h4>Pilih Kamar</h4>
                                    <p>Browse berbagai pilihan kamar premium</p>
                                </div>
                            </div>
                            <div className="right-step">
                                <div className="step-number">3</div>
                                <div className="step-info">
                                    <h4>Reservasi & Nikmati</h4>
                                    <p>Konfirmasi booking dan nikmati pengalaman terbaik</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;