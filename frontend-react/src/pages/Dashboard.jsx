import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import { getReviews } from "../services/reviewService";
import { getKamar } from "../services/kamarService";

const getAvatarByUsername = (username) => {
    const name = username ? username.toLowerCase() : "";
    if (name.includes("andi")) {
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150";
    }
    if (name.includes("dirga")) {
        return "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150";
    }
    if (name.includes("intan")) {
        return "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150";
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username || "User")}&background=random`;
};

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={i <= rating ? "star-filled" : "star-empty"}>
                ★
            </span>
        );
    }
    return stars;
};

function Dashboard() {
    const [publicReviews, setPublicReviews] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [allRev, rm] = await Promise.all([
                    getReviews(),
                    getKamar(),
                ]);
                setPublicReviews(allRev || []);
                setRooms(rm || []);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <GuestLayout>
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-banner-inner">
                    <div className="welcome-text">
                        <h2>Selamat Datang !</h2>
                        <p>
                            Nikmati pengalaman menginap terbaik bersama The Hotel dengan pelayanan profesional, kamar nyaman, dan suasana yang menyenangkan.
                        </p>
                    </div>
                    <div className="welcome-action">
                        <Link to="/kamar" className="btn-primary-guest">
                            Reservasi Sekarang
                        </Link>
                    </div>
                </div>
            </div>

            {/* Rekomendasi Kamar */}
            <div className="section-card" style={{ border: "none", background: "transparent", boxShadow: "none" }}>
                <div className="section-card-header" style={{ padding: "0 0 20px 0", borderBottom: "none", background: "transparent" }}>
                    <div>
                        <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#1e3a8a" }}>Rekomendasi Kamar</h3>
                    </div>
                </div>
                <div className="section-card-body" style={{ padding: 0 }}>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner" /></div>
                    ) : (
                        <div className="room-grid">
                            {rooms.filter(r => r.status === "Tersedia").slice(0, 4).map(room => (
                                <div key={room.id_kamar} className="room-card-guest">
                                    <div className="room-card-image">
                                        <img
                                            src={`http://127.0.0.1:8000${room.gambar}`}
                                            alt={room.tipe_kamar}
                                            onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"; }}
                                        />
                                    </div>
                                    <div className="room-card-body">
                                        <h3>{room.tipe_kamar}</h3>
                                        <p>{room.deskripsi}</p>
                                        <div className="room-price">
                                            Rp {Number(room.harga).toLocaleString("id-ID")} / malam
                                        </div>
                                        <Link to="/kamar" className="btn-reserve">
                                            Booking
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Pelanggan */}
            <div className="section-card-reviews">
                <h3 className="section-title">Review Pelanggan</h3>
                {loading ? (
                    <div className="loading-spinner"><div className="spinner" /></div>
                ) : (
                    <div className="review-grid">
                        {publicReviews.slice(0, 3).map((r) => (
                            <div key={r.id_review} className="review-card">
                                <div className="review-header">
                                    <img
                                        className="review-avatar"
                                        src={getAvatarByUsername(r.username)}
                                        alt={r.username}
                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"; }}
                                    />
                                    <div className="review-user-info">
                                        <span className="review-username">{r.username}</span>
                                        <div className="review-rating">{renderStars(r.rating)}</div>
                                    </div>
                                </div>
                                <div className="review-content">
                                    <p>{r.komentar}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}

export default Dashboard;
