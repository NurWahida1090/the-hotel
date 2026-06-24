import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import { getReviews, deleteReview } from "../services/reviewService";
import "../assets/css/admin.css";

function DataReview() {
    const [reviewsList, setReviewsList] = useState([]);
    const [search, setSearch] = useState("");
    const [filterRating, setFilterRating] = useState("");

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await getReviews();
                setReviewsList(data || []);
            } catch (err) {
                console.error("Gagal mengambil data review", err);
            }
        };
        loadReviews();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus ulasan ini?")) {
            try {
                await deleteReview(id);
                alert("Ulasan berhasil dihapus");
                setRefreshTrigger(prev => prev + 1);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.detail || "Gagal menghapus ulasan");
            }
        }
    };

    const renderStars = (rating) => {
        let stars = "";
        for (let i = 0; i < 5; i++) {
            stars += i < rating ? "★" : "☆";
        }
        return stars;
    };

    const filteredReviews = reviewsList.filter((r) => {
        const matchesSearch = 
            (r.username && r.username.toLowerCase().includes(search.toLowerCase())) ||
            (r.tipe_kamar && r.tipe_kamar.toLowerCase().includes(search.toLowerCase())) ||
            (r.komentar && r.komentar.toLowerCase().includes(search.toLowerCase()));

        const matchesRating = filterRating ? r.rating === Number(filterRating) : true;
        return matchesSearch && matchesRating;
    });

    return (
        <>
            <Sidebar />

            <div className="main">
                <Topbar />

                <section>
                    <div className="section-header">
                        <h2>Kelola Ulasan Tamu</h2>
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
                            placeholder="Cari ulasan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", flex: "1",
                                minWidth: "200px"
                            }}
                        />
                        <select 
                            value={filterRating} 
                            onChange={(e) => setFilterRating(e.target.value)}
                            style={{
                                padding: "10px 16px", border: "1px solid var(--border-color)",
                                borderRadius: "8px", outline: "none", fontSize: "14px", minWidth: "150px"
                            }}
                        >
                            <option value="">Semua Rating</option>
                            <option value="5">5 Bintang (★★★★★)</option>
                            <option value="4">4 Bintang (★★★★☆)</option>
                            <option value="3">3 Bintang (★★★☆☆)</option>
                            <option value="2">2 Bintang (★★☆☆☆)</option>
                            <option value="1">1 Bintang (★☆☆☆☆)</option>
                        </select>
                    </div>

                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tamu</th>
                                    <th>Tipe Kamar</th>
                                    <th>Rating</th>
                                    <th>Komentar</th>
                                    <th style={{ width: "120px" }}>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.length > 0 ? (
                                    filteredReviews.map((r) => (
                                        <tr key={r.id_review}>
                                            <td>#{r.id_review}</td>
                                            <td><strong>{r.username}</strong></td>
                                            <td>{r.tipe_kamar}</td>
                                            <td style={{ color: "var(--primary)", fontSize: "16px" }}>
                                                {renderStars(r.rating)}
                                            </td>
                                            <td>
                                                <p style={{ fontStyle: "italic", margin: 0 }}>
                                                    "{r.komentar}"
                                                </p>
                                            </td>
                                            <td>
                                                <button 
                                                    className="btn-sm btn-delete"
                                                    onClick={() => handleDelete(r.id_review)}
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                                            Tidak ada data ulasan ditemukan.
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

export default DataReview;