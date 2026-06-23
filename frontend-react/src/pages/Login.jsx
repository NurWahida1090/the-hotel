import "../assets/css/login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const data = await loginUser(
                username,
                password
            );

            localStorage.setItem(
                "token",
                data.access_token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

            if (data.role === "admin") {

                navigate("/admin/dashboard");

            } else {

                navigate("/dashboard");

            }

        } catch (err) {

            alert(
                err.response?.data?.detail ||
                "Login gagal"
            );

        }

    };

    return (

        <div className="login-page">

            <div className="container">

                <div className="left">

                    <h1>

                        Welcome Back!

                    </h1>

                    <p>

                        Login untuk mengakses reservasi kamar,
                        melihat data booking,
                        dan menikmati layanan terbaik dari The Hotel.

                    </p>

                </div>

                <div className="right">

                    <h2>Login</h2>

                    <p>

                        Silakan login ke akun Anda

                    </p>

                    <form
                        onSubmit={handleLogin}
                    >

                        <div className="input-box">

                            <label>

                                Username

                            </label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e)=>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="input-box">

                            <label>

                                Password

                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e)=>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn"
                        >

                            Login

                        </button>

                    </form>

                    <div className="bottom-text">

                        Belum punya akun?

                        <Link to="/register">

                            Register

                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;