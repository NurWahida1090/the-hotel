import { useEffect, useState } from "react";
import { getReviews } from "../services/homeService";

function ReviewSection() {

    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {

        const data = await getReviews();

        setReviews(data);

    };

    return (

        <section id="review">

            <div className="section-title">

                <h2>

                    Review Pelanggan

                </h2>

            </div>

            <div className="review-container">

                {reviews.map((review) => (

                    <div
                        key={review.id_review}
                        className="review-card"
                    >

                        <p>

                            "{review.komentar}"

                        </p>

                        <h4>

                            - {review.username}

                        </h4>

                        <p>

                            ⭐ {review.rating}/5

                        </p>

                    </div>

                ))}

            </div>

        </section>

    );

}

export default ReviewSection;