import { useNavigate } from "react-router-dom";

function HeroAdmin() {
    const navigate = useNavigate();

    return (
        <div className="hero-admin">
            <h1>Panel Kendali Admin</h1>
            <p>
                Kelola seluruh data operasional hotel dengan mudah dan cepat. 
                Pantau reservasi, ketersediaan kamar, hingga ulasan tamu dalam satu tempat.
            </p>
            <button onClick={() => navigate("/admin/reservasi")}>
                Kelola Reservasi
            </button>
        </div>
    );
}

export default HeroAdmin;