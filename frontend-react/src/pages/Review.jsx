import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import { getMyReviews, createReview, deleteReview } from "../services/reviewService";

function StarRating({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            {[1,2,3,4,5].map(s => (
                <span
                    key={s}
                    style={{
                        fontSize: 28,
                        cursor: onChange ? "pointer" : "default",
                        color: s <= (hovered || value) ? "#f59e0b" : "#e2e8f0",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={() => onChange && setHovered(s)}
                    onMouseLeave={() => onChange && setHovered(0)}
                    onClick={() => onChange && onChange(s)}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

function Review() {
    const location = useLocation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [idKamar, setIdKamar] = useState("");
    const [rating, setRating] = useState(5);
    const [komentar, setKomentar] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const qRoomId = queryParams.get("room") || location.state?.roomId;
        if (qRoomId) {
            setIdKamar(qRoomId);
            setShowForm(true);
        }
    }, [location]);

    const showToast = useCallback((msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const loadReviews = useCallback(async () => {
        try {
            const data = await getMyReviews();
            setReviews(data || []);
        } catch {
            showToast("Gagal memuat review", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getMyReviews();
                setReviews(data || []);
            } catch {
                showToast("Gagal memuat review", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [showToast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idKamar || !komentar.trim()) {
            showToast("Semua field harus diisi", "error");
            return;
        }
        setSubmitting(true);
        try {
            await createReview({
                id_kamar: parseInt(idKamar),
                rating,
                komentar: komentar.trim(),
            });
            showToast("Review berhasil dikirim! 🌟");
            setShowForm(false);
            setIdKamar("");
            setKomentar("");
            setRating(5);
            loadReviews();
        } catch (err) {
            const msg = err.response?.data?.detail || "Gagal mengirim review";
            showToast(msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await deleteReview(confirmDelete);
            showToast("Review berhasil dihapus");
            setConfirmDelete(null);
            loadReviews();
        } catch (err) {
            showToast(err.response?.data?.detail || "Gagal menghapus", "error");
            setConfirmDelete(null);
        }
    };

    const renderStars = (rating) => (
        <div className="review-stars">
            {[1,2,3,4,5].map(s => (
                <span key={s} className={`star ${s <= rating ? "filled" : "empty"}`}>★</span>
            ))}
        </div>
    );

    return (
        <GuestLayout>
            {/* Header */}
            <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                    <h1>Review Saya</h1>
                    <p>Bagikan pengalaman menginap Anda kepada tamu lainnya</p>
                </div>
                <button
                    className="btn-submit"
                    onClick={() => setShowForm(true)}
                    style={{ marginTop: 4 }}
                >
                    ✍️ Tulis Review
                </button>
            </div>

            {/* Info Banner */}
            <div style={{
                background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
                border: "1px solid #fde68a",
                borderRadius: 12,
                padding: "16px 20px",
                marginBottom: 24,
                fontSize: 14,
                color: "#92400e",
                display: "flex",
                alignItems: "center",
                gap: 10
            }}>
                <span style={{ fontSize: 20 }}>💡</span>
                <span>
                    <strong>Catatan:</strong> Anda hanya bisa memberikan review untuk kamar yang pernah Anda inapi dan sudah berstatus <strong>Selesai</strong>.
                </span>
            </div>

            {/* Review Grid */}
            {loading ? (
                <div className="loading-spinner"><div className="spinner" /></div>
            ) : reviews.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">⭐</div>
                    <h3>Belum Ada Review</h3>
                    <p>
                        Anda belum menulis review apapun. Setelah menyelesaikan proses
                        menginap, Anda dapat memberikan penilaian.
                    </p>
                    <button className="btn-submit" onClick={() => setShowForm(true)}>
                        ✍️ Tulis Review Pertama
                    </button>
                </div>
            ) : (
                <div className="review-grid">
                    {reviews.map(r => (
                        <div key={r.id_review} className="review-card-guest">
                            {renderStars(r.rating)}
                            <p className="review-comment">{r.komentar}</p>
                            <div className="review-author">
                                <div className="review-author-info">
                                    <h4>Kamar #{r.id_kamar}</h4>
                                    <p>{r.rating}/5 Bintang</p>
                                </div>
                                <div className="review-actions">
                                    <button
                                        className="btn-danger"
                                        onClick={() => setConfirmDelete(r.id_review)}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Write Review Modal */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✍️ Tulis Review</h3>
                            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">ID Kamar</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Masukkan ID kamar yang pernah Anda inapi..."
                                        value={idKamar}
                                        onChange={e => setIdKamar(e.target.value)}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Rating Anda</label>
                                    <StarRating value={rating} onChange={setRating} />
                                    <span style={{ fontSize: 13, color: "#64748b" }}>
                                        {["", "Sangat Buruk", "Buruk", "Cukup", "Bagus", "Sangat Bagus!"][rating]}
                                    </span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Komentar</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Ceritakan pengalaman menginap Anda di kamar ini..."
                                        value={komentar}
                                        onChange={e => setKomentar(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-submit" disabled={submitting}>
                                    {submitting ? "Mengirim..." : "🌟 Kirim Review"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
                        <div className="modal-header">
                            <h3>Hapus Review?</h3>
                            <button className="modal-close" onClick={() => setConfirmDelete(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
                                Apakah Anda yakin ingin menghapus review ini?
                                Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>
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
                                onClick={handleDelete}
                            >
                                Ya, Hapus
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

export default Review;
