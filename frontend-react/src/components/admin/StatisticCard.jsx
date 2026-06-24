import { FiClipboard, FiDatabase, FiAward, FiStar } from "react-icons/fi";

function StatisticCard({ statistik }) {
    const stats = [
        { label: "Total Reservasi", value: statistik.total_reservasi || 0, icon: <FiClipboard /> },
        { label: "Kamar Tersedia", value: statistik.total_kamar || 0, icon: <FiDatabase /> },
        { label: "Fasilitas Hotel", value: statistik.total_fasilitas || 0, icon: <FiAward /> },
        { label: "Ulasan Tamu", value: statistik.total_review || 0, icon: <FiStar /> },
    ];

    return (
        <div className="card-container">
            {stats.map((stat, index) => (
                <div key={index} className="card">
                    <div className="card-icon">{stat.icon}</div>
                    <h3>{stat.label}</h3>
                    <h1>{stat.value}</h1>
                </div>
            ))}
        </div>
    );
}

export default StatisticCard;