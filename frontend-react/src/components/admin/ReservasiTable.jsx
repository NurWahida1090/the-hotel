function ReservasiTable({ reservasi, onVerify }) {
    const getStatusBadge = (status) => {
        switch(status.toLowerCase()) {
            case "pending": return <span className="badge badge-yellow">Pending</span>;
            case "berhasil": return <span className="badge badge-green">Berhasil</span>;
            case "batal": return <span className="badge badge-red">Batal</span>;
            default: return <span className="badge badge-gray">{status}</span>;
        }
    };

    return (
        <section>
            <div className="section-header">
                <h2>Data Reservasi Terbaru</h2>
                <button className="btn-add">Eksport Laporan</button>
            </div>
            
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>No. Kamar</th>
                            <th>Tamu</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Total Bayar</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasi.map((res) => (
                            <tr key={res.id_reservasi}>
                                <td>#{res.id_kamar}</td>
                                <td>{res.tamu ? res.tamu.username : "Guest"}</td>
                                <td>{res.tanggal_check_in}</td>
                                <td>{res.tanggal_check_out}</td>
                                <td>Rp {Number(res.total_bayar).toLocaleString("id-ID")}</td>
                                <td>{getStatusBadge(res.status_reservasi)}</td>
                                <td>
                                    {res.status_reservasi === "Pending" && (
                                        <button 
                                            className="btn-sm btn-edit"
                                            onClick={() => onVerify && onVerify(res.id_reservasi)}
                                        >
                                            Verifikasi
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

export default ReservasiTable;