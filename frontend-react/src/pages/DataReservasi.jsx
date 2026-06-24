import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import { getAllReservations, updateReservationStatus } from "../services/reservationService";
import "../assets/css/admin.css";

function DataReservasi() {
    const [reservasiList, setReservasiList] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const loadReservasi = async () => {
            try {
                const data = await getAllReservations();
                setReservasiList(data || []);
            } catch (err) {
                console.error("Gagal mengambil data reservasi", err);
            }
        };
        loadReservasi();
    }, [refreshTrigger]);

    const handleUpdateStatus = async (id, newStatus) => {
        if (window.confirm(`Apakah Anda yakin ingin mengubah status reservasi ini menjadi "${newStatus}"?`)) {
            try {
                await updateReservationStatus(id, newStatus);
                alert("Status reservasi berhasil diperbarui");
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.detail || "Gagal memperbarui status reservasi");
            }
        }
    };

    // Calculate number of nights
    const calculateNights = (checkinStr, checkoutStr) => {
        const checkin = new Date(checkinStr);
        const checkout = new Date(checkoutStr);
        const diffTime = checkout.getTime() - checkin.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    // Filter and search
    const filteredReservasi = reservasiList.filter((res) => {
        const matchesSearch = 
            (res.username && res.username.toLowerCase().includes(search.toLowerCase())) ||
            (res.nomor_kamar && res.nomor_kamar.toLowerCase().includes(search.toLowerCase())) ||
            (res.tipe_kamar && res.tipe_kamar.toLowerCase().includes(search.toLowerCase()));
        
        const matchesStatus = filterStatus ? res.status_reservasi === filterStatus : true;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return <span className="badge badge-yellow">Pending</span>;
            case "Dikonfirmasi":
                return <span className="badge badge-green">Dikonfirmasi</span>;
            case "Check In":
                return <span className="badge badge-blue">Check In</span>;
            case "Selesai":
                return <span className="badge badge-gray">Selesai</span>;
            case "Batal":
                return <span className="badge badge-red">Batal</span>;
            default:
                return <span className="badge badge-gray">{status}</span>;
        }
    };

    // Export CSV Helper
    const exportCSV = () => {
        if (filteredReservasi.length === 0) {
            alert("Tidak ada data untuk diekspor");
            return;
        }

        const headers = ["ID", "Tamu", "Email", "No. Kamar", "Tipe Kamar", "Check In", "Check Out", "Durasi (Malam)", "Total Bayar", "Status"];
        const rows = filteredReservasi.map(res => {
            const nights = calculateNights(res.tanggal_checkin, res.tanggal_checkout);
            const total = nights * res.harga;
            return [
                res.id_reservasi,
                res.username,
                res.email,
                res.nomor_kamar,
                res.tipe_kamar,
                new Date(res.tanggal_checkin).toLocaleDateString("id-ID"),
                new Date(res.tanggal_checkout).toLocaleDateString("id-ID"),
                nights,
                total,
                res.status_reservasi
            ];
        });

        let csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Laporan_Reservasi_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <Sidebar />

            <div className="main">
                <Topbar />

                <section>
                    <div className="section-header">
                        <h2>Kelola Data Reservasi</h2>
                        <button className="btn-add" onClick={exportCSV}>
                            Ekspor Laporan (CSV)
                        </button>
                    </div>

                    {/* Filters & Search */}
                    <div style={{
                        display: "flex", gap: "16px", marginBottom: "24px", 
                        background: "white", padding: "16px 20px", borderRadius: "14px",
                        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)",
                        flexWrap: "wrap", alignItems: "center"
                    }}>
                        <input 
                            type="text"
                            placeholder="Cari tamu, nomor/tipe kamar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", flex: "1",
                                minWidth: "200px"
                            }}
                        />
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", minWidth: "150px"
                            }}
                        >
                            <option value="">Semua Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Dikonfirmasi">Dikonfirmasi</option>
                            <option value="Check In">Check In</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Batal">Batal</option>
                        </select>
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tamu</th>
                                    <th>Kamar</th>
                                    <th>Tipe Kamar</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Total Bayar</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: "center" }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservasi.length > 0 ? (
                                    filteredReservasi.map((res) => {
                                        const nights = calculateNights(res.tanggal_checkin, res.tanggal_checkout);
                                        const total = nights * res.harga;
                                        
                                        return (
                                            <tr key={res.id_reservasi}>
                                                <td>#{res.id_reservasi}</td>
                                                <td>
                                                    <div>
                                                        <strong>{res.username}</strong>
                                                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                                            {res.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><strong>Room {res.nomor_kamar}</strong></td>
                                                <td>{res.tipe_kamar}</td>
                                                <td>{new Date(res.tanggal_checkin).toLocaleDateString("id-ID")}</td>
                                                <td>{new Date(res.tanggal_checkout).toLocaleDateString("id-ID")}</td>
                                                <td>
                                                    <div>
                                                        <strong>Rp {total.toLocaleString("id-ID")}</strong>
                                                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                                                            {nights} Malam
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{getStatusBadge(res.status_reservasi)}</td>
                                                <td>
                                                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                        {res.status_reservasi === "Pending" && (
                                                            <>
                                                                <button 
                                                                    className="btn-sm btn-edit"
                                                                    onClick={() => handleUpdateStatus(res.id_reservasi, "Dikonfirmasi")}
                                                                    style={{ background: "#f0fdf4", color: "#16a34a" }}
                                                                >
                                                                    Konfirmasi
                                                                </button>
                                                                <button 
                                                                    className="btn-sm btn-delete"
                                                                    onClick={() => handleUpdateStatus(res.id_reservasi, "Batal")}
                                                                >
                                                                    Batalkan
                                                                </button>
                                                            </>
                                                        )}
                                                        {res.status_reservasi === "Dikonfirmasi" && (
                                                            <button 
                                                                className="btn-sm btn-edit"
                                                                onClick={() => handleUpdateStatus(res.id_reservasi, "Check In")}
                                                            >
                                                                Check In
                                                            </button>
                                                        )}
                                                        {res.status_reservasi === "Check In" && (
                                                            <button 
                                                                className="btn-sm btn-edit"
                                                                onClick={() => handleUpdateStatus(res.id_reservasi, "Selesai")}
                                                                style={{ background: "#f8fafc", color: "#64748b", border: "1px solid #cbd5e1" }}
                                                            >
                                                                Selesai
                                                            </button>
                                                        )}
                                                        {["Selesai", "Batal"].includes(res.status_reservasi) && (
                                                            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>None</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="9" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                            Tidak ada data reservasi ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}

export default DataReservasi;