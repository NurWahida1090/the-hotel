import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="hero" id="hero">

            <div className="hero-content">

                <h1>
                    Nikmati Pengalaman 
                </h1>
                <h1>
                    Menginap Terbaik
                </h1>

                <p>
                    The Hotel menghadirkan kenyamanan,
                    kemewahan,
                    dan pelayanan terbaik
                    untuk setiap tamu.
                </p>

                <div className="hero-btn">

                    <Link
                        to="/login"
                        className="btn-primary"
                    >
                        Pesan Sekarang
                    </Link>

                    <Link
                        to="/rooms"
                        className="btn-secondary"
                    >
                        Lihat Kamar
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default Hero;