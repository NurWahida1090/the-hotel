import { useEffect, useState } from "react";
import { getRooms } from "../services/homeService";
import { Link } from "react-router-dom";

function RoomSection() {

    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const loadRooms = async () => {

            try {

                const data = await getRooms();

                setRooms(data);

            } catch (error) {

                console.log(error);

            }

        };

        loadRooms();

    }, []);

    return (

        <section id="room">

            <h2>Pilihan Kamar</h2>

            <p>Pilih kamar terbaik</p>

            <div className="room-container">

                {
                    rooms.map((room) => (

                        <div
                            key={room.id_kamar}
                            className="room-card"
                        >

                            <img
                                src={`http://127.0.0.1:8000${room.gambar}`}
                                alt={room.tipe_kamar}
                            />

                            <div className="room-content">

                                <h3>

                                    {room.tipe_kamar}

                                </h3>

                                <p>

                                    {room.deskripsi}

                                </p>

                                <span className="price">

                                    Rp {Number(room.harga).toLocaleString("id-ID")}

                                </span>

                                <Link
                                    to="/login"
                                    className="card-btn"
                                >
                                    Reservasi
                                </Link>

                            </div>

                        </div>

                    ))
                }

            </div>

        </section>

    );

}

export default RoomSection;
