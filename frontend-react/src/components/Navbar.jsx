import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <div className="logo">The Hotel</div>

            <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#room">Kamar</a></li>
                <li><a href="#facility">Fasilitas</a></li>
                <li><a href="#about">Tentang</a></li>
                <li><a href="#review">Review</a></li>
            </ul>

            <div className="nav-btn">
                <Link className="login" to="/login">
                    Login
                </Link>

                <Link className="register" to="/register">
                    Register
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;