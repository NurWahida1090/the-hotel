import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import { getMyReservations, cancelReservation } from "../services/reservationService";
import { getKamar } from "../services/kamarService";

const getRoomFacilitiesDetail = (tipe) => {
    const type = tipe ? tipe.toLowerCase() : "";
    if (type.includes("deluxe")) {
        return ["WiFi Gratis", "AC", "TV Smart", "Sarapan", "Kamar Mandi", "Mini Bar"];
    }
    if (type.includes("family")) {
        return ["WiFi Gratis", "2 Bed", "TV Smart", "Bathtub", "Kamar Mandi"];
    }
    if (type.includes("suite")) {
        return ["WiFi Gratis", "Mini Bar", "Jacuzzi", "Living Room", "Kamar Mandi"];
    }
    return ["WiFi Gratis", "Kamar Mandi"];
};

function Reservasi() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const detailId = searchParams.get("detail");

    const [reservations, setReservations] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("semua");
    const [confirmCancel, setConfirmCancel] = useState(null);
    const [toast, setToast] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const loadData = useCallback(async () => {
        try {
            const [resData, roomsData] = await Promise.all([
                getMyReservations(),
                getKamar(),
            ]);
            setReservations(resData || []);
            setRooms(roomsData || []);
        } catch {
            showToast("Gagal memuat data reservasi", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCancel = async () => {
        if (!confirmCancel) return;
        try {
            await cancelReservation(confirmCancel);
            showToast("Reservasi berhasil dibatalkan");
            setConfirmCancel(null);
            setSearchParams({}); // return to list view
            loadData();
        } catch (err) {
            const msg = err.response?.data?.detail || "Gagal membatalkan";
            showToast(msg, "error");
            setConfirmCancel(null);
        }
    };

    const formatDate = (d) => {
        if (!d) return "";
        return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };

    const formatPaymentDate = (d) => {
        if (!d) return "";
        const date = new Date(d);
        date.setDate(date.getDate() - 2); // 2 days before check-in
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    };

    const filtered = filter === "semua"
        ? reservations
        : reservations.filter(r => r.status_reservasi === filter);

    // Find the currently selected detail reservation
    const detailReservation = detailId 
        ? reservations.find(r => r.id_reservasi === parseInt(detailId))
        : null;

    const detailRoom = detailReservation
        ? rooms.find(rm => rm.id_kamar === detailReservation.id_kamar) || {}
        : {};

    const duration = detailReservation
        ? Math.round((new Date(detailReservation.tanggal_checkout) - new Date(detailReservation.tanggal_checkin)) / 86400000)
        : 0;

    const totalPrice = detailRoom.harga ? detailRoom.harga * duration : 0;

    let statusPembayaran = "Menunggu";
    if (detailReservation) {
        if (["Selesai", "Dikonfirmasi", "Check In"].includes(detailReservation.status_reservasi)) {
            statusPembayaran = "Lunas";
        } else if (["Batal", "Ditolak"].includes(detailReservation.status_reservasi)) {
            statusPembayaran = "Batal";
        }
    }

    return (
        <GuestLayout>
            {detailReservation ? (
                /* Two-Column Detail View */
                <div className="booking-page-container">
                    {/* Left Column: Room Preview */}
                    <div className="booking-room-preview">
                        <img
                            className="booking-room-img"
                            src={detailRoom.gambar ? `http://127.0.0.1:8000${detailRoom.gambar}` : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"}
                            alt={detailRoom.tipe_kamar}
                            onError={e => {
                                e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";
                            }}
                        />
                        <div className="booking-room-preview-body">
                            <h2>{detailRoom.tipe_kamar}</h2>
                            <p className="booking-room-desc">
                                {detailRoom.deskripsi || "Kamar menghadirkan suasana modern dan nyaman dengan fasilitas lengkap untuk memberikan pengalaman menginap terbaik selama berada di The Hotel."}
                            </p>
                            
                            <div className="room-facilities-tags" style={{ marginTop: "16px", marginBottom: "20px" }}>
                                {getRoomFacilitiesDetail(detailRoom.tipe_kamar).map((fac, idx) => (
                                    <span key={idx} className="facility-tag">{fac}</span>
                                ))}
                            </div>

                            <div className="room-price-guest">
                                Rp {Number(detailRoom.harga || 0).toLocaleString("id-ID")} <span className="price-unit">/ malam</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Informasi Reservasi */}
                    <div className="booking-form-card" style={{ flex: 1.4 }}>
                        <div className="form-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3 style={{ margin: 0 }}>Informasi Reservasi</h3>
                            <span 
                                className={`room-status-badge-inline ${
                                    detailReservation.status_reservasi === "Selesai" ? "badge-available" :
                                    detailReservation.status_reservasi === "Pending" ? "badge-maintenance" : "badge-occupied"
                                }`}
                                style={{ textTransform: "capitalize", fontSize: "12px", padding: "6px 14px" }}
                            >
                                Reservasi {detailReservation.status_reservasi}
                            </span>
                        </div>

                        {/* Info Grid */}
                        <div className="reservation-info-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
                            <div className="info-block">
                                <span className="info-label">ID Reservasi</span>
                                <span className="info-value">RSV-2026-{String(detailReservation.id_reservasi).padStart(3, '0')}</span>
                            </div>
                            <div className="info-block">
                                <span className="info-label">Nama Pemesan</span>
                                <span className="info-value">{user.username || "Nur Wahida"}</span>
                            </div>
                            <div className="info-block">
                                <span className="info-label">Check In</span>
                                <span className="info-value">{formatDate(detailReservation.tanggal_checkin)}</span>
                            </div>
                            <div className="info-block">
                                <span className="info-label">Check Out</span>
                                <span className="info-value">{formatDate(detailReservation.tanggal_checkout)}</span>
                            </div>
                            <div className="info-block">
                                <span className="info-label">Jumlah Tamu</span>
                                <span className="info-value">2 Orang</span>
                            </div>
                            <div className="info-block">
                                <span className="info-label">Jumlah Kamar</span>
                                <span className="info-value">1 Kamar</span>
                            </div>
                            <div className="info-block">
                                <span className="info-label">Total Malam</span>
                                <span className="info-value">{duration} Malam</span>
                            </div>
                            <div className="info-block">
                                <span className="info-label">Total Harga</span>
                                <span className="info-value">Rp {totalPrice.toLocaleString("id-ID")}</span>
                            </div>
                        </div>

                        {/* Payment Box */}
                        <div className="payment-info-box">
                            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#1e3a8a", marginBottom: "12px" }}>Informasi Pembayaran</h4>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "#334155" }}>
                                <div><strong>Metode Pembayaran:</strong> Transfer Bank</div>
                                <div><strong>Status Pembayaran:</strong> {statusPembayaran}</div>
                                <div><strong>Tanggal Pembayaran:</strong> {formatPaymentDate(detailReservation.tanggal_checkin)}</div>
                                <div style={{ borderTop: "1px dashed #cbd5e1", marginTop: "8px", paddingTop: "8px", color: "#64748b" }}>
                                    <strong>Catatan:</strong> Terima kasih telah melakukan reservasi di The Hotel.
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                            <button 
                                className="btn-card-review" 
                                onClick={() => navigate(`/review?room=${detailReservation.id_kamar}`)}
                                style={{ flex: 1, padding: "12px", background: "#e2e8f0", color: "#475569", borderRadius: "8px", fontWeight: "600", border: "none", cursor: "pointer", textAlign: "center" }}
                            >
                                Beri Review
                            </button>
                            
                            <button 
                                className="btn-card-detail" 
                                onClick={() => {
                                    if (detailReservation.status_reservasi === "Pending") {
                                        setConfirmCancel(detailReservation.id_reservasi);
                                    } else {
                                        alert("Reservasi yang sudah berjalan atau selesai tidak dapat dibatalkan.");
                                    }
                                }}
                                style={{ flex: 1, padding: "12px", background: "#ef4444", color: "white", borderRadius: "8px", fontWeight: "600", border: "none", cursor: "pointer", textAlign: "center" }}
                            >
                                Batalkan Reservasi
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <>
                    {/* Header */}
                    <div className="section-card" style={{ border: "none", background: "transparent", boxShadow: "none", marginBottom: "8px" }}>
                        <div className="section-card-header" style={{ padding: "0 0 16px 0", borderBottom: "none", background: "transparent" }}>
                            <div>
                                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1e3a8a" }}>Riwayat & Status Reservasi</h2>
                                <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>Kelola reservasi kamar Anda dengan mudah dan cepat.</p>
                            </div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="filter-bar" style={{ marginBottom: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {["semua", "Pending", "Dikonfirmasi", "Check In", "Selesai", "Batal"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: 8,
                                    border: filter === f ? "none" : "1.5px solid #e2e8f0",
                                    background: filter === f ? "#2563eb" : "white",
                                    color: filter === f ? "white" : "#64748b",
                                    fontFamily: "Poppins,sans-serif",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                            >
                                {f === "semua" ? "Semua" : f}
                            </button>
                        ))}
                    </div>

                    {/* Cards List */}
                    {loading ? (
                        <div className="loading-spinner"><div className="spinner" /></div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>Tidak Ada Reservasi</h3>
                            <p>
                                {filter === "semua"
                                    ? "Anda belum memiliki reservasi. Mulai cari kamar sekarang!"
                                    : `Tidak ada reservasi dengan status "${filter}".`}
                            </p>
                        </div>
                    ) : (
                        <div className="reservations-list">
                            {filtered.map((r) => {
                                const room = rooms.find(rm => rm.id_kamar === r.id_kamar) || {};
                                const duration = Math.round((new Date(r.tanggal_checkout) - new Date(r.tanggal_checkin)) / 86400000);
                                const totalPrice = room.harga ? room.harga * duration : 0;
                                
                                let statusPembayaran = "Menunggu";
                                if (["Selesai", "Dikonfirmasi", "Check In"].includes(r.status_reservasi)) {
                                    statusPembayaran = "Lunas";
                                } else if (["Batal", "Ditolak"].includes(r.status_reservasi)) {
                                    statusPembayaran = "Batal";
                                }

                                const statusClassMap = {
                                    Pending: "status-pending",
                                    Dikonfirmasi: "status-confirmed",
                                    "Check In": "status-checkin",
                                    Selesai: "status-selesai",
                                    Batal: "status-batal",
                                    Ditolak: "status-ditolak",
                                };
                                const statusClass = statusClassMap[r.status_reservasi] || "status-pending";

                                return (
                                    <div key={r.id_reservasi} className="reservation-card-item">
                                        <div className="reservation-image-wrapper">
                                            <img
                                                src={room.gambar ? `http://127.0.0.1:8000${room.gambar}` : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"}
                                                alt={room.tipe_kamar || "Kamar"}
                                                onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"; }}
                                            />
                                        </div>
                                        <div className="reservation-details-wrapper">
                                            <div className="reservation-header-row">
                                                <h3>{room.tipe_kamar || `Kamar #${r.id_kamar}`}</h3>
                                                <span className={`status-badge ${statusClass}`}>
                                                    {r.status_reservasi}
                                                </span>
                                            </div>

                                            <div className="reservation-info-grid">
                                                <div className="info-block">
                                                    <span className="info-label">Check In</span>
                                                    <span className="info-value">{formatDate(r.tanggal_checkin)}</span>
                                                </div>
                                                <div className="info-block">
                                                    <span className="info-label">Check Out</span>
                                                    <span className="info-value">{formatDate(r.tanggal_checkout)}</span>
                                                </div>
                                                <div className="info-block">
                                                    <span className="info-label">Total Harga</span>
                                                    <span className="info-value">Rp {totalPrice.toLocaleString("id-ID")}</span>
                                                </div>
                                                <div className="info-block">
                                                    <span className="info-label">Status Pembayaran</span>
                                                    <span className="info-value">{statusPembayaran}</span>
                                                </div>
                                            </div>

                                            <div className="reservation-actions-row">
                                                <button
                                                    className="btn-card-detail"
                                                    onClick={() => setSearchParams({ detail: r.id_reservasi })}
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    className="btn-card-review"
                                                    onClick={() => navigate(`/review?room=${r.id_kamar}`)}
                                                >
                                                    Beri Review
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {/* Confirm Cancel Modal */}
            {confirmCancel && (
                <div className="modal-overlay" onClick={() => setConfirmCancel(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
                        <div className="modal-header">
                            <h3>Batalkan Reservasi?</h3>
                            <button className="modal-close" onClick={() => setConfirmCancel(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
                                Apakah Anda yakin ingin membatalkan reservasi ini?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setConfirmCancel(null)}>
                                Tidak
                            </button>
                            <button
                                style={{
                                    padding: "12px 24px",
                                    background: "#dc2626",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 8,
                                    fontWeight: 600,
                                    fontSize: 14,
                                    cursor: "pointer"
                                }}
                                onClick={handleCancel}
                            >
                                Ya, Batalkan
                            </button>
                        </div>
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

export default Reservasi;
