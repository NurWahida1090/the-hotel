function ReviewAdmin({ review, onDelete }) {
    const renderStars = (rating) => {
        let stars = "";
        for(let i=0; i<5; i++){
            stars += i < rating ? "★" : "☆";
        }
        return stars;
    };

    return (
        <section>
            <div className="section-header">
                <h2>Kelola Data Ulasan</h2>
                <button className="btn-add">Eksport Ulasan</button>
            </div>
            
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tamu</th>
                            <th>No. Kamar</th>
                            <th>Rating</th>
                            <th>Komentar</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {review.map((r) => (
                            <tr key={r.id_review}>
                                <td><strong>{r.tamu ? r.tamu.username : "Guest"}</strong></td>
                                <td>#{r.id_kamar}</td>
                                <td style={{ color: "var(--primary)", fontSize: "16px" }}>
                                    {renderStars(r.rating)}
                                </td>
                                <td><p style={{ fontStyle: "italic", margin: 0 }}>"{r.komentar}"</p></td>
                                <td>
                                    <button 
                                        className="btn-sm btn-delete"
                                        onClick={() => onDelete && onDelete(r.id_review)}
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ReviewAdmin;