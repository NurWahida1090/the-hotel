function AboutSection() {
    return (
        <section id="about" className="about">
            <div className="about-img-wrap reveal">
                <img
                    src="/17de8ce3d57e2fd000582d262bf9d841d4276f61.jpg"
                    alt="Luxury Hotel Exterior"
                />
            </div>
            <div className="about-content reveal" style={{ animationDelay: "0.2s" }}>
                <h4>Tentang Kami</h4>
                <h2>Definisi Baru Sebuah Kemewahan</h2>
                <p>
                    Berdiri sejak 2010, The Hotel telah menjadi ikon standar pelayanan 
                    perhotelan terbaik. Kami menggabungkan arsitektur klasik dengan 
                    fasilitas modern yang dirancang khusus untuk memanjakan Anda.
                </p>
                <p>
                    Setiap detail mulai dari penyambutan di lobi hingga kualitas sprei 
                    kamar Anda telah kami perhatikan dengan seksama. Misi kami adalah 
                    menciptakan sebuah kenangan manis yang akan selalu Anda ingat.
                </p>
            </div>
        </section>
    );
}

export default AboutSection;