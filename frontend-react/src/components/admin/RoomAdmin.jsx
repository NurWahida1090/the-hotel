function RoomAdmin({ data }) {

    return (

        <section id="kamar">

            <div className="section-header">

                <h2>

                    Data Kamar

                </h2>

            </div>

            <div className="grid-card">

                {

                    data.map((room)=>(

                        <div
                        className="room-card"
                        key={room.id_kamar}
                        >

                            <img
                            src={`http://127.0.0.1:8000${room.gambar}`}
                            />

                            <div className="room-body">

                                <h3>

                                    {room.tipe_kamar}

                                </h3>

                                <p>

                                    {room.deskripsi}

                                </p>

                                <h4>

                                    Rp {Number(room.harga).toLocaleString("id-ID")}

                                </h4>

                                <span className="status">

                                    {room.status}

                                </span>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default RoomAdmin;