import { useCallback, useEffect, useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import { getKamar } from "../services/kamarService";
import { createReservation } from "../services/reservationService";

const getRoomFacilities = (tipe) => {
    const type = tipe ? tipe.toLowerCase() : "";
    if (type.includes("deluxe")) {
        return ["WiFi", "AC", "TV", "Sarapan"];
    }
    if (type.includes("family")) {
        return ["WiFi", "2 Bed", "TV", "Bathtub"];
    }
    if (type.includes("suite")) {
        return ["WiFi", "Mini Bar", "Jacuzzi", "Living Room"];
    }
    return ["WiFi"];
};

function Kamar() {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("semua");
    const [search, setSearch] = useState("");

    // Modal state
    const [modal, setModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Toast
    const [toast, setToast] = useState(null);

    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const data = await getKamar();
                setRooms(data || []);
            } catch {
                showToast("Gagal memuat data kamar", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [showToast]);

    const openModal = (room) => {
        setSelectedRoom(room);
        setCheckin("");
        setCheckout("");
        setModal(true);
    };

    const closeModal = () => {
        setModal(false);
        setSelectedRoom(null);
    };

    const handleReservation = async (e) => {
        e.preventDefault();
        if (!checkin || !checkout) {
            showToast("Tanggal harus diisi", "error");
            return;
        }
        if (new Date(checkout) <= new Date(checkin)) {
            showToast("Tanggal checkout harus setelah check-in", "error");
            return;
        }
        setSubmitting(true);
        try {
            await createReservation({
                id_kamar: selectedRoom.id_kamar,
                tanggal_checkin: checkin,
                tanggal_checkout: checkout,
            });
            showToast("Reservasi berhasil dibuat! 🎉");
            closeModal();
        } catch (err) {
            const msg = err.response?.data?.detail || "Gagal membuat reservasi";
            showToast(msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = rooms.filter(r => {
        const matchFilter = filter === "semua" || r.status === filter;
        const matchSearch = r.tipe_kamar.toLowerCase().includes(search.toLowerCase()) ||
            r.deskripsi?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const today = new Date().toISOString().split("T")[0];

    return (
        <GuestLayout>
            {/* Page Header */}
            <div className="page-header" style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1e3a8a" }}>Pilih Kamar Terbaik Anda</h1>
                <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
                    Temukan berbagai tipe kamar dengan fasilitas lengkap dan harga terbaik hanya di The Hotel.
                </p>
            </div>

            {/* Room Grid */}
            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🛏️</div>
                    <h3>Tidak Ada Kamar</h3>
                    <p>Tidak ada kamar yang tersedia saat ini.</p>
                </div>
            ) : (
                <div className="room-grid">
                    {filtered.map(room => (
                        <div key={room.id_kamar} className="room-card-guest">
                            <div className="room-card-image">
                                <img
                                    src={`http://127.0.0.1:8000${room.gambar}`}
                                    alt={room.tipe_kamar}
                                    onError={e => {
                                        e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400";
                                    }}
                                />
                            </div>
                            <div className="room-card-body">
                                <div className="room-card-header-row">
                                    <h3>{room.tipe_kamar}</h3>
                                    <span className={`room-status-badge-inline ${room.status === "Tersedia" ? "badge-available" : room.status === "Terisi" ? "badge-occupied" : "badge-maintenance"}`}>
                                        {room.status}
                                    </span>
                                </div>
                                <p>{room.deskripsi || "Kamar nyaman dengan fasilitas lengkap."}</p>
                                
                                {/* Room Facilities */}
                                <div className="room-facilities-tags">
                                    {getRoomFacilities(room.tipe_kamar).map((fac, idx) => (
                                        <span key={idx} className="facility-tag">{fac}</span>
                                    ))}
                                </div>

                                <div className="room-price-guest">
                                    Rp {Number(room.harga).toLocaleString("id-ID")} <span className="price-unit">/ malam</span>
                                </div>
                                
                                <button
                                    className={`btn-reserve-kamar ${room.status !== "Tersedia" ? "disabled" : ""}`}
                                    onClick={() => room.status === "Tersedia" && openModal(room)}
                                    disabled={room.status !== "Tersedia"}
                                >
                                    {room.status === "Tersedia" ? "Booking" :
                                     room.status === "Terisi" ? "Sedang Terisi" : "Dalam Perbaikan"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reservation Modal */}
            {modal && selectedRoom && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Buat Reservasi</h3>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleReservation}>
                            <div className="modal-body">
                                {/* Room Preview */}
                                <div className="form-room-preview">
                                    <img
                                        src={`http://127.0.0.1:8000${selectedRoom.gambar}`}
                                        alt={selectedRoom.tipe_kamar}
                                        onError={e => {
                                            e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200";
                                        }}
                                    />
                                    <div className="preview-info">
                                        <h4>{selectedRoom.tipe_kamar}</h4>
                                        <p>Rp {Number(selectedRoom.harga).toLocaleString("id-ID")} / malam</p>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Tanggal Check In</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        min={today}
                                        value={checkin}
                                        onChange={e => setCheckin(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tanggal Check Out</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        min={checkin || today}
                                        value={checkout}
                                        onChange={e => setCheckout(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-submit" disabled={submitting}>
                                    {submitting ? "Memproses..." : "Konfirmasi Booking"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && (
                <div className={`toast ${toast.type === "error" ? "error" : ""}`}>
                    {toast.type === "error" ? "❌" : "✅"} {toast.msg}
                </div>
            )}
        </GuestLayout>
    );
}

export default Kamar;
