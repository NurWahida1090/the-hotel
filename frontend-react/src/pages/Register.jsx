import "../assets/css/register.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    registerUser
}
from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [username,setUsername] =
        useState("");

    const [email,setEmail] =
        useState("");

    const [password,setPassword] =
        useState("");

    const [confirmPassword,
        setConfirmPassword]
        = useState("");

    const handleRegister =
    async(e)=>{

        e.preventDefault();

        if(
            password !==
            confirmPassword
        ){

            alert(
                "Password tidak sama"
            );

            return;

        }

        try{

            await registerUser({

                username,
                email,
                password

            });

            alert(
                "Register berhasil"
            );

            navigate("/login");

        }

        catch(err){

            alert(
                err.response?.data?.detail
            );

        }

    };

    return(

        <div className="register-page">

            <div className="container">

                <div className="left">

                    <h2>

                        Register

                    </h2>

                    <p>

                        Buat akun baru

                    </p>

                    <form
                        onSubmit={
                            handleRegister
                        }
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

                                Email

                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e)=>
                                    setEmail(
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

                        <div className="input-box">

                            <label>

                                Konfirmasi Password

                            </label>

                            <input
                                type="password"
                                value={
                                    confirmPassword
                                }
                                onChange={(e)=>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <button
                            className="btn"
                            type="submit"
                        >

                            Register

                        </button>

                    </form>

                    <div className="bottom-text">

                        Sudah punya akun?

                        <Link to="/login">

                            Login

                        </Link>

                    </div>

                </div>

                <div className="right">

                    <h1>

                        The Hotel

                    </h1>

                    <p>

                        Bergabung bersama kami
                        dan nikmati pengalaman
                        reservasi hotel yang mudah.

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Register;