function StatisticCard({ statistik }) {

    return (

        <div className="card-container">

            <div className="card">

                <h3>Total Reservasi</h3>

                <h1>

                    {statistik.total_reservasi}

                </h1>

            </div>

            <div className="card">

                <h3>Total Kamar</h3>

                <h1>

                    {statistik.total_kamar}

                </h1>

            </div>

            <div className="card">

                <h3>Total Fasilitas</h3>

                <h1>

                    {statistik.total_fasilitas}

                </h1>

            </div>

            <div className="card">

                <h3>Total Review</h3>

                <h1>

                    {statistik.total_review}

                </h1>

            </div>

        </div>

    );

}

export default StatisticCard;