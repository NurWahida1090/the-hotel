import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`home-nav ${scrolled ? "scrolled" : ""}`}>
            <div className="logo">
                The Hotel
            </div>

            <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#room">Kamar</a></li>
                <li><a href="#facility">Fasilitas</a></li>
                <li><a href="#about">Tentang</a></li>
                <li><a href="#review">Review</a></li>
            </ul>

            <div className="nav-btn">
                <Link className="login" to="/login">
                    Masuk
                </Link>

                <Link className="register" to="/register">
                    Daftar
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;