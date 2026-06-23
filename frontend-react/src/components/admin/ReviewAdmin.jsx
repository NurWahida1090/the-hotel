function ReviewAdmin({ data }) {

    return (

        <section id="review">

            <div className="section-header">

                <h2>

                    Data Review

                </h2>

            </div>

            <div className="grid-card">

                {

                    data.map((item)=>(

                        <div
                        className="review-card"
                        key={item.id_review}
                        >

                            <h3>

                                {item.username}

                            </h3>

                            <small>

                                {item.tipe_kamar}

                            </small>

                            <br/>

                            <br/>

                            <strong>

                                ⭐ {item.rating}/5

                            </strong>

                            <p>

                                {item.komentar}

                            </p>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}

export default ReviewAdmin;