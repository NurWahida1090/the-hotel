import "../assets/css/login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await loginUser(username, password);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data));
            if (data.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            alert(err.response?.data?.detail || "Login gagal. Periksa kembali username dan password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="container">
                {/* LEFT */}
                <div className="left">
                    <div className="left-inner">
                        <h1>Welcome !</h1>
                        <p>
                            Login untuk mengakses reservasi kamar,
                            melihat data booking, dan menikmati layanan
                            terbaik dari The Hotel.
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="right">
                    <h2>Login</h2>
                    <p>Silakan login ke akun Anda</p>

                    <form onSubmit={handleLogin}>
                        <div className="input-box">
                            <label>Email</label>
                            <input
                                type="text"
                                placeholder="Masukkan email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-box" style={{ marginBottom: 12 }}>
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Link to="#" className="forgot-password">Lupa Password?</Link>
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? "Login..." : "Login"}
                        </button>
                    </form>

                    <div className="bottom-text">
                        Belum punya akun? <Link to="/register" className="register-link">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;