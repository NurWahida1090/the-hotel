import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import { getKamar, tambahKamar, hapusKamar } from "../services/kamarService";
import "../assets/css/admin.css";

function DataKamar() {
    const navigate = useNavigate();
    const [kamarList, setKamarList] = useState([]);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    
    // Modal state for Add Room
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        nomor_kamar: "",
        tipe_kamar: "Deluxe Room",
        harga: "",
        status: "Tersedia",
        gambar: "/static/kamar/deluxe1.jpg",
        deskripsi: ""
    });
    const [loading, setLoading] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const loadKamar = async () => {
            try {
                const data = await getKamar();
                setKamarList(data || []);
            } catch (err) {
                console.error("Gagal mengambil data kamar", err);
            }
        };
        loadKamar();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus kamar ini?")) {
            try {
                await hapusKamar(id);
                alert("Kamar berhasil dihapus");
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                console.error(err);
                alert("Gagal menghapus kamar. Kemungkinan kamar sedang digunakan dalam transaksi.");
            }
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!form.nomor_kamar || !form.harga || !form.deskripsi) {
            alert("Harap isi semua kolom.");
            return;
        }

        setLoading(true);
        try {
            await tambahKamar({
                ...form,
                harga: Number(form.harga)
            });
            alert("Kamar baru berhasil ditambahkan!");
            setModalOpen(false);
            setForm({
                nomor_kamar: "",
                tipe_kamar: "Deluxe Room",
                harga: "",
                status: "Tersedia",
                gambar: "/static/kamar/deluxe1.jpg",
                deskripsi: ""
            });
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert(err.response?.data?.detail || "Gagal menambahkan kamar.");
        } finally {
            setLoading(false);
        }
    };

    // Filter and Search logic
    const filteredKamar = kamarList.filter((k) => {
        const matchesSearch = k.nomor_kamar.toLowerCase().includes(search.toLowerCase()) || 
                              k.tipe_kamar.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType ? k.tipe_kamar === filterType : true;
        const matchesStatus = filterStatus ? k.status === filterStatus : true;
        return matchesSearch && matchesType && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "Tersedia":
                return <span className="badge badge-green">Tersedia</span>;
            case "Terisi":
                return <span className="badge badge-blue">Terisi</span>;
            case "Maintenance":
                return <span className="badge badge-yellow">Maintenance</span>;
            default:
                return <span className="badge badge-gray">{status}</span>;
        }
    };

    return (
        <>
            <Sidebar />

            <div className="main">
                <Topbar />

                <section>
                    <div className="section-header">
                        <h2>Kelola Data Kamar</h2>
                        <button className="btn-add" onClick={() => setModalOpen(true)}>
                            Tambah Kamar
                        </button>
                    </div>

                    {/* Search & Filters */}
                    <div style={{
                        display: "flex", gap: "16px", marginBottom: "24px", 
                        background: "white", padding: "16px 20px", borderRadius: "14px",
                        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)",
                        flexWrap: "wrap", alignItems: "center"
                    }}>
                        <input 
                            type="text"
                            placeholder="Cari nomor/tipe kamar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", flex: "1",
                                minWidth: "200px"
                            }}
                        />
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", minWidth: "150px"
                            }}
                        >
                            <option value="">Semua Tipe</option>
                            <option value="Deluxe Room">Deluxe Room</option>
                            <option value="Family Room">Family Room</option>
                            <option value="Suite Room">Suite Room</option>
                        </select>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", minWidth: "150px"
                            }}
                        >
                            <option value="">Semua Status</option>
                            <option value="Tersedia">Tersedia</option>
                            <option value="Terisi">Terisi</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Gambar</th>
                                    <th>No. Kamar</th>
                                    <th>Tipe Kamar</th>
                                    <th>Harga / Malam</th>
                                    <th>Status</th>
                                    <th>Deskripsi</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredKamar.length > 0 ? (
                                    filteredKamar.map((k) => (
                                        <tr key={k.id_kamar}>
                                            <td>
                                                <img 
                                                    src={`http://127.0.0.1:8000${k.gambar}`} 
                                                    alt={k.tipe_kamar}
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&auto=format&fit=crop&q=60";
                                                    }}
                                                    style={{ 
                                                        width: "70px", height: "45px", 
                                                        objectFit: "cover", borderRadius: "8px" 
                                                    }}
                                                />
                                            </td>
                                            <td><strong>{k.nomor_kamar}</strong></td>
                                            <td>{k.tipe_kamar}</td>
                                            <td>Rp {Number(k.harga).toLocaleString("id-ID")}</td>
                                            <td>{getStatusBadge(k.status)}</td>
                                            <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {k.deskripsi}
                                            </td>
                                            <td>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button 
                                                        className="btn-sm btn-edit"
                                                        onClick={() => navigate(`/admin/kamar/edit/${k.id_kamar}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn-sm btn-delete"
                                                        onClick={() => handleDelete(k.id_kamar)}
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                            Tidak ada data kamar ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Tambah Kamar Modal */}
            {modalOpen && createPortal(
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>Tambah Kamar Baru</h3>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleAddRoom}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nomor Kamar</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="Contoh: 101"
                                        value={form.nomor_kamar}
                                        onChange={(e) => setForm({ ...form, nomor_kamar: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tipe Kamar</label>
                                    <select 
                                        className="form-select"
                                        value={form.tipe_kamar}
                                        onChange={(e) => setForm({ ...form, tipe_kamar: e.target.value })}
                                    >
                                        <option value="Deluxe Room">Deluxe Room</option>
                                        <option value="Family Room">Family Room</option>
                                        <option value="Suite Room">Suite Room</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Harga per Malam (Rp)</label>
                                    <input 
                                        type="number" 
                                        className="form-input" 
                                        placeholder="Contoh: 500000"
                                        value={form.harga}
                                        onChange={(e) => setForm({ ...form, harga: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Status</label>
                                    <select 
                                        className="form-select"
                                        value={form.status}
                                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    >
                                        <option value="Tersedia">Tersedia</option>
                                        <option value="Terisi">Terisi</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pilih Preset Gambar Kamar</label>
                                    <select 
                                        className="form-select"
                                        value={form.gambar}
                                        onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                                        style={{ marginBottom: "10px" }}
                                    >
                                        <option value="/static/kamar/deluxe1.jpg">Deluxe Room (/static/kamar/deluxe1.jpg)</option>
                                        <option value="/static/kamar/family1.jpg">Family Room (/static/kamar/family1.jpg)</option>
                                        <option value="/static/kamar/suite1.jpg">Suite Room (/static/kamar/suite1.jpg)</option>
                                        <option value="custom">Kustom URL / Path</option>
                                    </select>
                                    {form.gambar === "custom" || !form.gambar.startsWith("/static/") ? (
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="Masukkan path gambar, contoh: /static/kamar/kustom.jpg"
                                            value={form.gambar === "custom" ? "" : form.gambar}
                                            onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                                            required
                                        />
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deskripsi Kamar</label>
                                    <textarea 
                                        className="form-textarea" 
                                        placeholder="Deskripsikan kelebihan dan fasilitas kamar..."
                                        value={form.deskripsi}
                                        onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? "Menyimpan..." : "Tambah Kamar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default DataKamar;