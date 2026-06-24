import { useCallback, useEffect, useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import { getKamar } from "../services/kamarService";
import { createReservation } from "../services/reservationService";

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

    const getStatusBadge = (status) => {
        if (status === "Tersedia") return "badge-available";
        if (status === "Terisi") return "badge-occupied";
        return "badge-maintenance";
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
            <div className="page-header">
                <h1>Pilih Kamar Anda</h1>
                <p>Temukan kamar yang paling sesuai dengan kebutuhan Anda</p>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="search-input-wrap">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Cari tipe kamar..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="semua">Semua Kamar</option>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Terisi">Terisi</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
            </div>

            {/* Room Grid */}
            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🛏️</div>
                    <h3>Tidak Ada Kamar</h3>
                    <p>Tidak ada kamar yang sesuai dengan pencarian Anda saat ini.</p>
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
                                <span className={`room-status-badge ${getStatusBadge(room.status)}`}>
                                    {room.status}
                                </span>
                            </div>
                            <div className="room-card-body">
                                <h3>{room.tipe_kamar}</h3>
                                <p>{room.deskripsi || "Kamar nyaman dengan fasilitas lengkap."}</p>
                                <div className="room-price">
                                    Rp {Number(room.harga).toLocaleString("id-ID")}
                                    <span> / malam</span>
                                </div>
                                <button
                                    className={`btn-reserve ${room.status !== "Tersedia" ? "disabled" : ""}`}
                                    onClick={() => room.status === "Tersedia" && openModal(room)}
                                    disabled={room.status !== "Tersedia"}
                                >
                                    {room.status === "Tersedia" ? "Reservasi Sekarang" :
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

                                {checkin && checkout && new Date(checkout) > new Date(checkin) && (
                                    <div style={{
                                        background: "#f0f9ff",
                                        border: "1px solid #bae6fd",
                                        borderRadius: 8,
                                        padding: "12px 16px",
                                        fontSize: 13,
                                        color: "#0369a1"
                                    }}>
                                        <strong>Durasi:</strong>{" "}
                                        {Math.round((new Date(checkout) - new Date(checkin)) / 86400000)} malam ·{" "}
                                        <strong>Total Estimasi:</strong>{" "}
                                        Rp {(Number(selectedRoom.harga) * Math.round((new Date(checkout) - new Date(checkin)) / 86400000)).toLocaleString("id-ID")}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={closeModal}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-submit" disabled={submitting}>
                                    {submitting ? "Memproses..." : "Konfirmasi Reservasi"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type === "error" ? "error" : ""}`}>
                    {toast.type === "error" ? "❌" : "✅"} {toast.msg}
                </div>
            )}
        </GuestLayout>
    );
}

export default Kamar;
