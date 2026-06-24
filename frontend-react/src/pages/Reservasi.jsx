import { useCallback, useEffect, useState } from "react";
import GuestLayout from "../layouts/GuestLayout";
import { getMyReservations, cancelReservation } from "../services/reservationService";

const STATUS_MAP = {
    Pending:      { cls: "status-pending",   label: "Pending",        icon: "⏳" },
    Dikonfirmasi: { cls: "status-confirmed", label: "Dikonfirmasi",   icon: "✅" },
    "Check In":   { cls: "status-checkin",   label: "Check In",       icon: "🏨" },
    Selesai:      { cls: "status-selesai",   label: "Selesai",        icon: "🎉" },
    Batal:        { cls: "status-batal",     label: "Dibatalkan",     icon: "❌" },
    Ditolak:      { cls: "status-ditolak",   label: "Ditolak",        icon: "🚫" },
};

function Reservasi() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("semua");
    const [confirmCancel, setConfirmCancel] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const loadReservations = useCallback(async () => {
        try {
            const data = await getMyReservations();
            setReservations(data || []);
        } catch {
            showToast("Gagal memuat data reservasi", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const data = await getMyReservations();
                setReservations(data || []);
            } catch {
                showToast("Gagal memuat data reservasi", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [showToast]);

    const handleCancel = async () => {
        if (!confirmCancel) return;
        try {
            await cancelReservation(confirmCancel);
            showToast("Reservasi berhasil dibatalkan");
            setConfirmCancel(null);
            loadReservations();
        } catch (err) {
            const msg = err.response?.data?.detail || "Gagal membatalkan";
            showToast(msg, "error");
            setConfirmCancel(null);
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    const getDuration = (ci, co) => {
        const diff = Math.round((new Date(co) - new Date(ci)) / 86400000);
        return `${diff} malam`;
    };

    const filtered = filter === "semua"
        ? reservations
        : reservations.filter(r => r.status_reservasi === filter);

    return (
        <GuestLayout>
            <div className="page-header">
                <h1>Reservasi Saya</h1>
                <p>Daftar semua reservasi kamar yang telah Anda buat</p>
            </div>

            {/* Filter */}
            <div className="filter-bar">
                {["semua", "Pending", "Dikonfirmasi", "Check In", "Selesai", "Batal"].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: 8,
                            border: filter === f ? "none" : "1.5px solid #e2e8f0",
                            background: filter === f ? "linear-gradient(135deg,#1e3a8a,#2563eb)" : "white",
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

            {/* Table */}
            <div className="section-card">
                <div className="section-card-body" style={{ padding: 0 }}>
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
                        <div className="reservasi-table-wrap">
                            <table className="reservasi-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID Kamar</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Durasi</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r) => {
                                        const s = STATUS_MAP[r.status_reservasi] || {
                                            cls: "status-pending", label: r.status_reservasi, icon: "📋"
                                        };
                                        const canCancel = r.status_reservasi === "Pending";
                                        return (
                                            <tr key={r.id_reservasi}>
                                                <td style={{ fontWeight: 600, color: "#94a3b8" }}>#{r.id_reservasi}</td>
                                                <td>
                                                    <span style={{
                                                        background: "#f0f4ff",
                                                        padding: "4px 10px",
                                                        borderRadius: 6,
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: "#2563eb"
                                                    }}>
                                                        Kamar #{r.id_kamar}
                                                    </span>
                                                </td>
                                                <td>{formatDate(r.tanggal_checkin)}</td>
                                                <td>{formatDate(r.tanggal_checkout)}</td>
                                                <td style={{ color: "#64748b" }}>
                                                    {getDuration(r.tanggal_checkin, r.tanggal_checkout)}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${s.cls}`}>
                                                        {s.icon} {s.label}
                                                    </span>
                                                </td>
                                                <td>
                                                    {canCancel ? (
                                                        <button
                                                            className="btn-danger"
                                                            onClick={() => setConfirmCancel(r.id_reservasi)}
                                                        >
                                                            Batalkan
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: "#cbd5e1", fontSize: 13 }}>—</span>
                                                    )}
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
                                    background: "linear-gradient(135deg,#dc2626,#ef4444)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: 10,
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
