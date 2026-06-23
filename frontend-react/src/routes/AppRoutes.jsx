import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Kamar from "../pages/Kamar";
import Fasilitas from "../pages/Fasilitas";
import Reservasi from "../pages/Reservasi";
import Review from "../pages/Review";
import Checkin from "../pages/Checkin";
import Checkout from "../pages/Checkout";
import AdminDashboard from "../pages/AdminDashboard";
import DataKamar from "../pages/DataKamar";
import EditKamar from "../pages/EditKamar";
import DataFasilitas from "../pages/DataFasilitas";
import DataReservasi from "../pages/DataReservasi";
import DataReview from "../pages/DataReview";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/kamar" element={<Kamar />} />
                <Route path="/fasilitas" element={<Fasilitas />} />
                <Route path="/reservasi" element={<Reservasi />} />
                <Route path="/review" element={<Review />} />
                <Route path="/checkin" element={<Checkin />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/kamar" element={<DataKamar />} />
                <Route path="/admin/kamar/edit/:id" element={<EditKamar />} />
                <Route path="/admin/fasilitas" element={<DataFasilitas />} />
                <Route path="/admin/reservasi" element={<DataReservasi />} />
                <Route path="/admin/review" element={<DataReview />} />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;