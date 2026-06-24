function FacilityAdmin({ fasilitas, onDelete }) {
    return (
        <section>
            <div className="section-header">
                <h2>Kelola Fasilitas Hotel</h2>
                <button className="btn-add">Tambah Fasilitas</button>
            </div>
            
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Nama Fasilitas</th>
                            <th>Deskripsi</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fasilitas.map((f) => (
                            <tr key={f.id_fasilitas}>
                                <td><strong>{f.nama_fasilitas}</strong></td>
                                <td>{f.deskripsi}</td>
                                <td>
                                    <div style={{display: "flex", gap: "8px"}}>
                                        <button className="btn-sm btn-edit">Edit</button>
                                        <button 
                                            className="btn-sm btn-delete"
                                            onClick={() => onDelete && onDelete(f.id_fasilitas)}
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

export default FacilityAdmin;