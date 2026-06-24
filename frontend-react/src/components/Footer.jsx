import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer-section">
            <div className="footer-container">
                <div className="footer-grid">
                    
                    {/* Brand Section */}
                    <div className="footer-col brand-col">
                        <h2 className="footer-logo">The Hotel</h2>
                        <p className="footer-desc">
                            Menghadirkan harmoni sempurna antara kemewahan kelas dunia 
                            dan kehangatan keramahan lokal. Temukan esensi kenyamanan 
                            yang sesungguhnya bersama kami.
                        </p>
                        <div className="footer-socials">
                            <a href="#" className="social-link" aria-label="Facebook"><FaFacebook /></a>
                            <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
                            <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
                        </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div className="footer-col links-col">
                        <h3>Navigasi</h3>
                        <ul>
                            <li><a href="#hero">Beranda</a></li>
                            <li><a href="#room">Kamar</a></li>
                            <li><a href="#facility">Fasilitas</a></li>
                            <li><a href="#about">Tentang Kami</a></li>
                            <li><a href="#review">Ulasan</a></li>
                        </ul>
                    </div>
                    
                    {/* Services / Kamar Pilihan */}
                    <div className="footer-col links-col">
                        <h3>Layanan</h3>
                        <ul>
                            <li><Link to="/kamar">Reservasi Kamar</Link></li>
                            <li><Link to="/login">Akun Tamu</Link></li>
                            <li><Link to="/register">Daftar Member</Link></li>
                            <li><Link to="/dashboard">Status Pemesanan</Link></li>
                        </ul>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="footer-col contact-col">
                        <h3>Hubungi Kami</h3>
                        <ul className="contact-info-list">
                            <li>
                                <FaMapMarkerAlt className="contact-icon" />
                                <span>Jl. Kemewahan No. 88, Nusa Dua, Bali, Indonesia</span>
                            </li>
                            <li>
                                <FaPhone className="contact-icon" />
                                <span>+62 361 1234567</span>
                            </li>
                            <li>
                                <FaEnvelope className="contact-icon" />
                                <span>info@thehotel.com</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
            
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p>&copy; {new Date().getFullYear()} The Hotel. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Kebijakan Privasi</a>
                        <a href="#">Syarat & Ketentuan</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;