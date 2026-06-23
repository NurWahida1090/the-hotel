import "../assets/css/home.css";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import RoomSection from "../components/RoomSection";
import FacilitySection from "../components/FacilitySection";
import AboutSection from "../components/AboutSection.jsx";
import ReviewSection from "../components/ReviewSection";
import Footer from "../components/Footer";
// import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <RoomSection />
            <FacilitySection />
            <AboutSection />
            <ReviewSection /> 
            <Footer />
        </>
    );
}

export default Home;