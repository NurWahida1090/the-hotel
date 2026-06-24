import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Hero() {
    const navigate = useNavigate();
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");

    const handleSearch = () => {
        if (checkin && checkout) {
            navigate("/kamar");
        }
    };

    return (
        <section className="hero" id="hero">
            <div className="hero-content reveal">
                <h1>Pengalaman Menginap Tak Terlupakan</h1>
                <p>
                    Kenyamanan dan kemewahan berpadu dalam layanan kelas dunia. 
                    Temukan destinasi peristirahatan terbaik Anda bersama The Hotel.
                </p>
                <div className="hero-btn">
                    <Link to="/kamar" className="btn-primary">Pesan Sekarang</Link>
                    <a href="#room" className="btn-secondary">Lihat Kamar</a>
                </div>
            </div>

            {/* Glassmorphism Booking Widget */}
            <div className="booking-widget reveal" style={{ animationDelay: "0.2s" }}>
                <div className="widget-group">
                    <label>Check-in</label>
                    <input 
                        type="date" 
                        value={checkin} 
                        onChange={e => setCheckin(e.target.value)} 
                    />
                </div>
                <div className="widget-group">
                    <label>Check-out</label>
                    <input 
                        type="date" 
                        value={checkout} 
                        onChange={e => setCheckout(e.target.value)} 
                    />
                </div>
                <div className="widget-group">
                    <label>Tamu</label>
                    <select>
                        <option>1 Dewasa</option>
                        <option>2 Dewasa</option>
                        <option>Keluarga</option>
                    </select>
                </div>
                <button className="widget-btn" onClick={handleSearch}>
                    Cari Kamar
                </button>
            </div>
        </section>
    );
}

export default Hero;