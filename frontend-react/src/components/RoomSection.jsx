import { useEffect, useState } from "react";
import { getRooms } from "../services/homeService";
import { Link } from "react-router-dom";

function RoomSection() {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const data = await getRooms();
                setRooms(data || []);
            } catch (e) {
                console.error("Gagal memuat kamar:", e);
            }
        };

        loadRooms();
    }, []);

    return (
        <section id="room">
            <div className="section-title reveal">
                <h2>Kamar Tersedia</h2>
                <p>
                    Nikmati waktu istirahat yang berkualitas dengan fasilitas premium 
                    dan desain interior yang menawan di setiap kamar kami.
                </p>
            </div>

            <div className="room-container">
                {rooms.slice(0, 6).map((room, index) => (
                    <div
                        key={room.id_kamar}
                        className="room-card reveal"
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        <div className="room-img-wrap">
                            <span className="room-badge">Premium</span>
                            <img
                                src={`http://127.0.0.1:8000${room.gambar}`}
                                alt={room.tipe_kamar}
                                onError={e => {
                                    e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600";
                                }}
                            />
                        </div>

                        <div className="room-content">
                            <h3>{room.tipe_kamar}</h3>
                            <p>{room.deskripsi}</p>
                            
                            <div className="room-footer">
                                <div className="price-wrap">
                                    <span className="price-label">Mulai Dari</span>
                                    <span className="price">
                                        Rp {Number(room.harga).toLocaleString("id-ID")}
                                    </span>
                                </div>
                                <Link to="/kamar" className="card-btn">
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default RoomSection;
