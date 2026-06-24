import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import { getFacilities, tambahFasilitas, editFasilitas, hapusFasilitas } from "../services/facilityService";
import "../assets/css/admin.css";

function DataFasilitas() {
    const [facilitiesList, setFacilitiesList] = useState([]);
    const [search, setSearch] = useState("");
    
    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState({
        nama_fasilitas: "",
        deskripsi: "",
        gambar: "/static/fasilitas/wifi.jpg"
    });
    const [loading, setLoading] = useState(false);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const loadFacilities = async () => {
            try {
                const data = await getFacilities();
                setFacilitiesList(data || []);
            } catch (err) {
                console.error("Gagal mengambil data fasilitas", err);
            }
        };
        loadFacilities();
    }, [refreshTrigger]);

    const openAddModal = () => {
        setIsEditMode(false);
        setForm({
            nama_fasilitas: "",
            deskripsi: "",
            gambar: "/static/fasilitas/wifi.jpg"
        });
        setModalOpen(true);
    };

    const openEditModal = (facility) => {
        setIsEditMode(true);
        setSelectedId(facility.id_fasilitas);
        setForm({
            nama_fasilitas: facility.nama_fasilitas,
            deskripsi: facility.deskripsi,
            gambar: facility.gambar
        });
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus fasilitas ini?")) {
            try {
                await hapusFasilitas(id);
                alert("Fasilitas berhasil dihapus");
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                console.error(err);
                alert("Gagal menghapus fasilitas.");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.nama_fasilitas || !form.deskripsi) {
            alert("Harap isi semua kolom.");
            return;
        }

        setLoading(true);
        try {
            if (isEditMode) {
                await editFasilitas(selectedId, form);
                alert("Fasilitas berhasil diperbarui!");
            } else {
                await tambahFasilitas(form);
                alert("Fasilitas baru berhasil ditambahkan!");
            }
            setModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            alert(err.response?.data?.detail || "Gagal menyimpan data fasilitas.");
        } finally {
            setLoading(false);
        }
    };

    const filteredFacilities = facilitiesList.filter((f) => 
        f.nama_fasilitas.toLowerCase().includes(search.toLowerCase()) ||
        f.deskripsi.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Sidebar />

            <div className="main">
                <Topbar />

                <section>
                    <div className="section-header">
                        <h2>Kelola Fasilitas Hotel</h2>
                        <button className="btn-add" onClick={openAddModal}>
                            Tambah Fasilitas
                        </button>
                    </div>

                    {/* Search Field */}
                    <div style={{
                        display: "flex", gap: "16px", marginBottom: "24px", 
                        background: "white", padding: "16px 20px", borderRadius: "14px",
                        boxShadow: "var(--shadow-sm)", border: "1px solid var(--border-color)"
                    }}>
                        <input 
                            type="text"
                            placeholder="Cari fasilitas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", flex: "1"
                            }}
                        />
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Gambar</th>
                                    <th>Nama Fasilitas</th>
                                    <th>Deskripsi</th>
                                    <th style={{ width: "200px" }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFacilities.length > 0 ? (
                                    filteredFacilities.map((f) => (
                                        <tr key={f.id_fasilitas}>
                                            <td>
                                                <img 
                                                    src={`http://127.0.0.1:8000${f.gambar}`} 
                                                    alt={f.nama_fasilitas}
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=60";
                                                    }}
                                                    style={{ 
                                                        width: "70px", height: "45px", 
                                                        objectFit: "cover", borderRadius: "8px" 
                                                    }}
                                                />
                                            </td>
                                            <td><strong>{f.nama_fasilitas}</strong></td>
                                            <td>{f.deskripsi}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button 
                                                        className="btn-sm btn-edit"
                                                        onClick={() => openEditModal(f)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="btn-sm btn-delete"
                                                        onClick={() => handleDelete(f.id_fasilitas)}
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                            Tidak ada data fasilitas ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Add / Edit Modal */}
            {modalOpen && createPortal(
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3>{isEditMode ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}</h3>
                            <button className="modal-close" onClick={() => setModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Nama Fasilitas</label>
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        placeholder="Contoh: Kolam Renang VIP"
                                        value={form.nama_fasilitas}
                                        onChange={(e) => setForm({ ...form, nama_fasilitas: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Pilih Preset Gambar</label>
                                    <select 
                                        className="form-select"
                                        value={form.gambar}
                                        onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                                        style={{ marginBottom: "10px" }}
                                    >
                                        <option value="/static/fasilitas/wifi.jpg">Wifi Gratis (/static/fasilitas/wifi.jpg)</option>
                                        <option value="/static/fasilitas/kolam.jpg">Kolam Renang (/static/fasilitas/kolam.jpg)</option>
                                        <option value="/static/fasilitas/restoran.jpg">Restoran (/static/fasilitas/restoran.jpg)</option>
                                        <option value="/static/fasilitas/gym.jpg">Gym Center (/static/fasilitas/gym.jpg)</option>
                                        <option value="custom">Kustom URL / Path</option>
                                    </select>
                                    {form.gambar === "custom" || !form.gambar.startsWith("/static/") ? (
                                        <input 
                                            type="text" 
                                            className="form-input" 
                                            placeholder="Masukkan path gambar, contoh: /static/fasilitas/kustom.jpg"
                                            value={form.gambar === "custom" ? "" : form.gambar}
                                            onChange={(e) => setForm({ ...form, gambar: e.target.value })}
                                            required
                                        />
                                    ) : null}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Deskripsi</label>
                                    <textarea 
                                        className="form-textarea" 
                                        placeholder="Deskripsikan fungsi dan jadwal ketersediaan fasilitas..."
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
                                    {loading ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Tambah Fasilitas"}
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

export default DataFasilitas;