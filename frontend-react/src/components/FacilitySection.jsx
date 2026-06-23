import { useEffect, useState } from "react";
import { getFacilities } from "../services/homeService";

function FacilitySection() {

    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        loadFacilities();
    }, []);

    const loadFacilities = async () => {

        const data = await getFacilities();

        setFacilities(data);

    };

    return (

        <section id="facility">

            <div className="section-title">

                <h2>Fasilitas Hotel</h2>

                <p>
                    Fasilitas lengkap untuk kenyamanan Anda
                </p>

            </div>

            <div className="facility-container">

                {facilities.map((facility) => (

                    <div
                        key={facility.id_fasilitas}
                        className="facility-card"
                    >

                        <img
                            src={`http://127.0.0.1:8000${facility.gambar}`}
                            style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: "50%"
                            }}
                        />

                        <h3>

                            {facility.nama_fasilitas}

                        </h3>

                        <p>

                            {facility.deskripsi}

                        </p>

                    </div>

                ))}

            </div>

        </section>

    );

}

export default FacilitySection;