import { Link } from "react-router-dom";

function AboutSection() {
    return (
        <section id="about">

            <div className="about">

                <img
                    src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1470&auto=format&fit=crop"
                    alt=""
                />

                <div className="about-content">

                    <h2>

                        Welcome To The Hotel

                    </h2>

                    <p>

                        The Hotel merupakan hotel modern yang menghadirkan kenyamanan,
                        kemewahan,
                        dan pelayanan terbaik untuk setiap tamu.

                    </p>

                    <p>

                        Dengan fasilitas lengkap serta suasana nyaman,
                        The Hotel menjadi pilihan terbaik.

                    </p>

                    <Link
                        to="/login"
                        className="btn-primary"
                    >
                        Reservasi Sekarang
                    </Link>

                </div>

            </div>

        </section>
    );
}

export default AboutSection;