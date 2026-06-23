function FacilityAdmin({ data }) {

    return (

        <section id="fasilitas">

            <div className="section-header">

                <h2>

                    Data Fasilitas

                </h2>

            </div>

            <div className="grid-card">

                {

                    data.map((item)=>(

                        <div
                        className="facility-card"
                        key={item.id_fasilitas}
                        >

                            <img
                            src={`http://127.0.0.1:8000${item.gambar}`}
                            />

                            <h3>

                                {item.nama_fasilitas}

                            </h3>

                            <p>

                                {item.deskripsi}

                            </p>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default FacilityAdmin;