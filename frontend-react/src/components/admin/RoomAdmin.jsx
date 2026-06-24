function RoomAdmin({ kamar, onDelete }) {
    return (
        <section>
            <div className="section-header">
                <h2>Kelola Data Kamar</h2>
                <button className="btn-add">Tambah Kamar</button>
            </div>
            
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Tipe Kamar</th>
                            <th>Deskripsi</th>
                            <th>Harga / Malam</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {kamar.map((k) => (
                            <tr key={k.id_kamar}>
                                <td>
                                    <img 
                                        src={`http://127.0.0.1:8000${k.gambar}`} 
                                        alt={k.tipe_kamar}
                                        style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "6px" }}
                                    />
                                </td>
                                <td><strong>{k.tipe_kamar}</strong></td>
                                <td>{k.deskripsi.substring(0, 50)}...</td>
                                <td>Rp {Number(k.harga).toLocaleString("id-ID")}</td>
                                <td>
                                    <div style={{display: "flex", gap: "8px"}}>
                                        <button className="btn-sm btn-edit">Edit</button>
                                        <button 
                                            className="btn-sm btn-delete"
                                            onClick={() => onDelete && onDelete(k.id_kamar)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default RoomAdmin;