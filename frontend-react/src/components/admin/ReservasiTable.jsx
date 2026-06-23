function ReservasiTable({ data }) {
    return (
        <section id="reservasi">

            <div className="section-header">
                <h2>Data Reservasi</h2>
            </div>

            <table className="table">

                <thead>

                    <tr>

                        <th>User</th>

                        <th>Kamar</th>

                        <th>Check In</th>

                        <th>Check Out</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {data.map((item) => (

                        <tr
                            key={item.id_reservasi}
                        >

                            <td>

                                {item.username}

                            </td>

                            <td>

                                {item.tipe_kamar}

                            </td>

                            <td>

                                {item.tanggal_checkin}

                            </td>

                            <td>

                                {item.tanggal_checkout}

                            </td>

                            <td>

                                {item.status_reservasi}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </section>
    );
}

export default ReservasiTable;