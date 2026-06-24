import { useEffect, useState } from "react";
import { getFacilities } from "../services/homeService";

const internetImages = {
    "wifi gratis": "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
    "kolam renang": "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600&auto=format&fit=crop",
    "restoran": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop",
    "gym center": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
};

function FacilitySection() {
    const [facilities, setFacilities] = useState([]);

    useEffect(() => {
        const loadFacilities = async () => {
            try {
                const data = await getFacilities();
                setFacilities(data || []);
            } catch (e) {
                console.error("Gagal memuat fasilitas:", e);
            }
        };

        loadFacilities();
    }, []);

    const getImageUrl = (facility) => {
        if (facility.gambar && (facility.gambar.startsWith("http://") || facility.gambar.startsWith("https://"))) {
            return facility.gambar;
        }
        const nameLower = (facility.nama_fasilitas || "").toLowerCase().trim();
        if (internetImages[nameLower]) {
            return internetImages[nameLower];
        }
        const backendUrl = "http://127.0.0.1:8000";
        return facility.gambar ? `${backendUrl}${facility.gambar}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop";
    };

    return (
        <section id="facility">
            <div className="section-title reveal">
                <h2>Fasilitas Eksklusif</h2>
                <p>
                    Nikmati kelengkapan fasilitas hotel berbintang yang dirancang 
                    khusus untuk memenuhi segala kebutuhan relaksasi dan hiburan Anda.
                </p>
            </div>

            <div className="facility-container">
                {facilities.map((facility, index) => (
                    <div
                        key={facility.id_fasilitas}
                        className="facility-card reveal"
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        <div className="facility-img-wrap">
                            <img
                                src={getImageUrl(facility)}
                                alt={facility.nama_fasilitas}
                                loading="lazy"
                            />
                        </div>
                        <h3>{facility.nama_fasilitas}</h3>
                        <p>{facility.deskripsi}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FacilitySection;
