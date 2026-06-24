import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import GuestLayout from "../layouts/GuestLayout";
import { getKamar } from "../services/kamarService";
import { createReservation } from "../services/reservationService";

const getRoomFacilities = (tipe) => {
    const type = tipe ? tipe.toLowerCase() : "";
    if (type.includes("deluxe")) {
        return ["WiFi", "AC", "TV", "Sarapan", "Bathroom"];
    }
    if (type.includes("family")) {
        return ["WiFi", "2 Bed", "TV", "Bathtub", "Bathroom"];
    }
    if (type.includes("suite")) {
        return ["WiFi", "Mini Bar", "Jacuzzi", "Living Room", "Bathroom"];
    }
    return ["WiFi", "Bathroom"];
};

function Kamar() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingRoomId = searchParams.get("booking");

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form fields for reservation
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [fullName, setFullName] = useState(user.username || "");
    const [emailInput, setEmailInput] = useState(user.email || "");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");
    const [guestCount, setGuestCount] = useState("1 Orang");
    const [additionalNotes, setAdditionalNotes] = useState("");
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

    const handleConfirmBooking = async (e) => {
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
            const bookingRoom = rooms.find(r => r.id_kamar === parseInt(bookingRoomId));
            if (!bookingRoom) throw new Error("Kamar tidak valid");

            await createReservation({
                id_kamar: bookingRoom.id_kamar,
                tanggal_checkin: checkin,
                tanggal_checkout: checkout,
            });
            showToast("Reservasi berhasil dibuat! 🎉");
            navigate("/reservasi");
        } catch (err) {
            const msg = err.response?.data?.detail || err.message || "Gagal membuat reservasi";
            showToast(msg, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    // Find the currently selected booking room
    const bookingRoom = bookingRoomId 
        ? rooms.find(r => r.id_kamar === parseInt(bookingRoomId)) 
        : null;

    return (
        <GuestLayout>
            {bookingRoom ? (
                /* Booking Page View (Two-column layout) */
                <div className="booking-page-container">
                    {/* Left Column: Room Preview */}
                    <div className="booking-room-preview">
                        <img
                            className="booking-room-img"
                            src={`http://127.0.0.1:8000${bookingRoom.gambar}`}
                            alt={bookingRoom.tipe_kamar}
                            onError={e => {
                                e.target.src = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800";
                            }}
                        />
                        <div className="booking-room-preview-body">
                            <h2>{bookingRoom.tipe_kamar}</h2>
                            <p className="booking-room-desc">
                                {bookingRoom.deskripsi || "Kamar modern dengan desain elegan dan fasilitas lengkap untuk memberikan pengalaman menginap terbaik."}
                            </p>
                            
                            <div className="room-facilities-tags" style={{ marginTop: "16px", marginBottom: "20px" }}>
                                {getRoomFacilities(bookingRoom.tipe_kamar).map((fac, idx) => (
                                    <span key={idx} className="facility-tag">{fac}</span>
                                ))}
                            </div>

                            <div className="room-price-guest" style={{ marginBottom: "8px" }}>
                                Rp {Number(bookingRoom.harga).toLocaleString("id-ID")} <span className="price-unit">/ malam</span>
                            </div>
                            <div className="room-availability-text" style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>
                                Tersedia 3 kamar
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Reservasi */}
                    <div className="booking-form-card">
                        <div className="form-card-header">
                            <h3>Form Reservasi</h3>
                            <p>Lengkapi data berikut untuk melakukan booking kamar.</p>
                        </div>
                        <form onSubmit={handleConfirmBooking}>
                            <div className="form-group">
                                <label className="form-label">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Masukkan nama lengkap"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="Masukkan email"
                                    value={emailInput}
                                    onChange={e => setEmailInput(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">No Telepon</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Masukkan nomor telepon"
                                    value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group-row" style={{ display: "flex", gap: "16px" }}>
                                <div className="form-group" style={{ flex: 1 }}>
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
                                <div className="form-group" style={{ flex: 1 }}>
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

                            <div className="form-group">
                                <label className="form-label">Jumlah Tamu</label>
                                <select
                                    className="form-select"
                                    value={guestCount}
                                    onChange={e => setGuestCount(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                        background: "#f8fafc",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "13px",
                                        outline: "none"
                                    }}
                                >
                                    <option value="1 Orang">1 Orang</option>
                                    <option value="2 Orang">2 Orang</option>
                                    <option value="3 Orang">3 Orang</option>
                                    <option value="4 Orang">4 Orang</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Catatan Tambahan</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Tambahkan catatan jika diperlukan..."
                                    value={additionalNotes}
                                    onChange={e => setAdditionalNotes(e.target.value)}
                                    style={{
                                        width: "100%",
                                        height: "100px",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                        background: "#f8fafc",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "13px",
                                        resize: "none",
                                        outline: "none"
                                    }}
                                />
                            </div>

                            <button type="submit" className="btn-confirm-booking" disabled={submitting}>
                                {submitting ? "Memproses..." : "Konfirmasi Booking"}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                /* Room Grid View */
                <>
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
                    ) : rooms.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🛏️</div>
                            <h3>Tidak Ada Kamar</h3>
                            <p>Tidak ada kamar yang tersedia saat ini.</p>
                        </div>
                    ) : (
                        <div className="room-grid">
                            {rooms.map(room => (
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
                                            onClick={() => room.status === "Tersedia" && navigate(`/kamar?booking=${room.id_kamar}`)}
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
                </>
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
