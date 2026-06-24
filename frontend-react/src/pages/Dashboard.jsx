import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiClock, FiCheckCircle, FiStar, FiInbox } from "react-icons/fi";
import GuestLayout from "../layouts/GuestLayout";
import { getMyReservations } from "../services/reservationService";
import { getMyReviews } from "../services/reviewService";
import { getKamar } from "../services/kamarService";

const STATUS_MAP = {
    Pending:   { cls: "status-pending",   label: "Pending"   },
    Dikonfirmasi: { cls: "status-confirmed", label: "Dikonfirmasi" },
    "Check In":  { cls: "status-checkin",  label: "Check In"  },
    Selesai:   { cls: "status-selesai",   label: "Selesai"   },
    Batal:     { cls: "status-batal",     label: "Batal"     },
    Ditolak:   { cls: "status-ditolak",   label: "Ditolak"   },
};

function Dashboard() {
    const [reservations, setReservations] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [res, rev, rm] = await Promise.all([
                    getMyReservations(),
                    getMyReviews(),
                    getKamar(),
                ]);
                setReservations(res || []);
                setReviews(rev || []);
                setRooms(rm || []);
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const totalSpend = reservations
        .filter(r => r.status_reservasi === "Selesai")
        .length;

    const activeRes = reservations.filter(
        r => ["Pending", "Dikonfirmasi", "Check In"].includes(r.status_reservasi)
    ).length;

    const available = rooms.filter(r => r.status === "Tersedia").length;

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

    return (
        <GuestLayout>
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div className="welcome-banner-inner">
                    <div className="welcome-text">
                        <h2>Selamat Datang, {user.username || "Tamu"}! 👋</h2>
                        <p>
                            Temukan kamar terbaik dan nikmati pengalaman menginap
                            yang tak terlupakan bersama The Hotel.
                        </p>
                    </div>
                    <div className="welcome-action">
                        <Link to="/kamar" className="btn-primary-guest">
                            Cari Kamar
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="stat-grid">
                <div className="stat-card blue">
                    <div className="stat-icon-wrap"><FiClipboard /></div>
                    <div className="stat-info">
                        <div className="stat-value">{reservations.length}</div>
                        <div className="stat-label">Total Reservasi</div>
                    </div>
                </div>
                <div className="stat-card amber">
                    <div className="stat-icon-wrap"><FiClock /></div>
                    <div className="stat-info">
                        <div className="stat-value">{activeRes}</div>
                        <div className="stat-label">Reservasi Aktif</div>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon-wrap"><FiCheckCircle /></div>
                    <div className="stat-info">
                        <div className="stat-value">{totalSpend}</div>
                        <div className="stat-label">Selesai Menginap</div>
                    </div>
                </div>
                <div className="stat-card purple">
                    <div className="stat-icon-wrap"><FiStar /></div>
                    <div className="stat-info">
                        <div className="stat-value">{reviews.length}</div>
                        <div className="stat-label">Review Ditulis</div>
                    </div>
                </div>
            </div>

            {/* Recent Reservations */}
            <div className="section-card">
                <div className="section-card-header">
                    <div>
                        <h3>Reservasi Terbaru</h3>
                        <p>Histori booking kamar Anda</p>
                    </div>
                    <Link to="/reservasi" className="btn-primary-guest" style={{ padding: "8px 16px", fontSize: "13px" }}>
                        Lihat Semua →
                    </Link>
                </div>
                <div className="section-card-body" style={{ padding: 0 }}>
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner" /></div>
                    ) : reservations.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"><FiInbox /></div>
                            <h3>Belum Ada Reservasi</h3>
                            <p>Anda belum memiliki reservasi kamar. Mulai pesan sekarang!</p>
                            <Link to="/kamar" className="btn-submit">Cari Kamar</Link>
                        </div>
                    ) : (
                        <div className="reservasi-table-wrap">
                            <table className="reservasi-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Kamar</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.slice(0, 5).map((r, i) => {
                                        const s = STATUS_MAP[r.status_reservasi] || { cls: "status-pending", label: r.status_reservasi };
                                        return (
                                            <tr key={r.id_reservasi}>
                                                <td>{i + 1}</td>
                                                <td>Kamar #{r.id_kamar}</td>
                                                <td>{formatDate(r.tanggal_checkin)}</td>
                                                <td>{formatDate(r.tanggal_checkout)}</td>
                                                <td>
                                                    <span className={`status-badge ${s.cls}`}>
                                                        {s.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Access */}
            <div className="section-card">
                <div className="section-card-header">
                    <div>
                        <h3>Kamar Tersedia</h3>
                        <p>{available} kamar siap untuk dipesan</p>
                    </div>
                    <Link to="/kamar" className="btn-primary-guest" style={{ padding: "8px 16px", fontSize: "13px" }}>
                        Lihat Semua →
                    </Link>
                </div>
                <div className="section-card-body">
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
                                        <span className="room-status-badge badge-available">Tersedia</span>
                                    </div>
                                    <div className="room-card-body">
                                        <h3>{room.tipe_kamar}</h3>
                                        <p>{room.deskripsi}</p>
                                        <div className="room-price">
                                            Rp {Number(room.harga).toLocaleString("id-ID")}
                                            <span> / malam</span>
                                        </div>
                                        <Link to="/kamar" className="btn-reserve">
                                            Reservasi Sekarang
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </GuestLayout>
    );
}

export default Dashboard;
