import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import { getMyReservations, cancelReservation } from "../services/reservationService";
import { getKamar } from "../services/kamarService";

function Reservasi() {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("semua");
    const [confirmCancel, setConfirmCancel] = useState(null);
    const [detailModal, setDetailModal] = useState(null);
    const [toast, setToast] = useState(null);

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

    const filtered = filter === "semua"
        ? reservations
        : reservations.filter(r => r.status_reservasi === filter);

    return (
        <GuestLayout>
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
                                            onClick={() => setDetailModal(r)}
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

            {/* Detail Modal */}
            {detailModal && (() => {
                const room = rooms.find(rm => rm.id_kamar === detailModal.id_kamar) || {};
                const duration = Math.round((new Date(detailModal.tanggal_checkout) - new Date(detailModal.tanggal_checkin)) / 86400000);
                const totalPrice = room.harga ? room.harga * duration : 0;
                const canCancel = detailModal.status_reservasi === "Pending";

                return (
                    <div className="modal-overlay" onClick={() => setDetailModal(null)}>
                        <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 460 }}>
                            <div className="modal-header">
                                <h3>Detail Reservasi #{detailModal.id_reservasi}</h3>
                                <button className="modal-close" onClick={() => setDetailModal(null)}>×</button>
                            </div>
                            <div className="modal-body" style={{ fontSize: "14px", lineHeight: "1.6", color: "#334155" }}>
                                <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                                    <img
                                        src={room.gambar ? `http://127.0.0.1:8000${room.gambar}` : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"}
                                        alt={room.tipe_kamar}
                                        style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400"; }}
                                    />
                                    <div>
                                        <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#1e3a8a", margin: 0 }}>{room.tipe_kamar}</h4>
                                        <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "13px" }}>Nomor Kamar: {room.nomor_kamar || "N/A"}</p>
                                        <p style={{ margin: "2px 0 0 0", color: "#64748b", fontSize: "13px" }}>Harga: Rp {Number(room.harga || 0).toLocaleString("id-ID")} / malam</p>
                                    </div>
                                </div>
                                <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#64748b" }}>Tanggal Check In:</span>
                                        <strong style={{ color: "#1e293b" }}>{formatDate(detailModal.tanggal_checkin)}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#64748b" }}>Tanggal Check Out:</span>
                                        <strong style={{ color: "#1e293b" }}>{formatDate(detailModal.tanggal_checkout)}</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#64748b" }}>Durasi Menginap:</span>
                                        <strong style={{ color: "#1e293b" }}>{duration} malam</strong>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "#64748b" }}>Status Reservasi:</span>
                                        <span className={`status-badge ${detailModal.status_reservasi === "Pending" ? "status-pending" : detailModal.status_reservasi === "Selesai" ? "status-selesai" : "status-confirmed"}`} style={{ display: "inline-block", padding: "3px 10px", margin: 0 }}>
                                            {detailModal.status_reservasi}
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #e2e8f0" }}>
                                        <span style={{ color: "#64748b", fontSize: "15px", fontWeight: "600" }}>Total Pembayaran:</span>
                                        <strong style={{ color: "#2563eb", fontSize: "16px", fontWeight: "700" }}>Rp {totalPrice.toLocaleString("id-ID")}</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer" style={{ justifyContent: canCancel ? "space-between" : "flex-end" }}>
                                {canCancel && (
                                    <button
                                        style={{
                                            padding: "10px 20px",
                                            background: "#ef4444",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                            fontSize: "13px",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => {
                                            setConfirmCancel(detailModal.id_reservasi);
                                            setDetailModal(null);
                                        }}
                                    >
                                        Batalkan Reservasi
                                    </button>
                                )}
                                <button className="btn-cancel" onClick={() => setDetailModal(null)} style={{ margin: 0 }}>
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

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
