import { useEffect, useState } from "react";
import { getReviews } from "../services/reviewService";

function ReviewSection() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await getReviews();
                setReviews(data || []);
            } catch (e) {
                console.error("Gagal memuat review:", e);
            }
        };

        loadReviews();
    }, []);

    const renderStars = (rating) => {
        let stars = "";
        for (let i = 0; i < 5; i++) {
            stars += i < rating ? "★" : "☆";
        }
        return stars;
    };

    return (
        <section id="review">
            <div className="section-title reveal">
                <h2>Testimoni Tamu</h2>
                <p>
                    Pengalaman otentik dari tamu yang telah menikmati 
                    layanan kelas dunia di The Hotel.
                </p>
            </div>

            <div className="review-container">
                {reviews.slice(0, 3).map((review, index) => (
                    <div
                        key={review.id_review}
                        className="review-card reveal"
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        <div className="quote-icon">"</div>
                        <div className="review-stars">
                            {renderStars(review.rating)}
                        </div>
                        <p>{review.komentar}</p>
                        
                        <div className="review-author">
                            <div className="author-avatar">
                                {/* Fallback user initial */}
                                {(review.tamu?.username || "G").charAt(0).toUpperCase()}
                            </div>
                            <div className="author-info">
                                <h4>{review.tamu?.username || "Guest"}</h4>
                                <span>Kamar #{review.id_kamar}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ReviewSection;
