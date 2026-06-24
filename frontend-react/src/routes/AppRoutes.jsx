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
import { ProtectedRoute, PublicRoute } from "../components/AuthRoutes";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />
                
                {/* Public Auth Routes */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                
                {/* Guest / User Portal Routes */}
                <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["user"]}><Dashboard /></ProtectedRoute>} />
                <Route path="/kamar" element={<ProtectedRoute allowedRoles={["user"]}><Kamar /></ProtectedRoute>} />
                <Route path="/fasilitas" element={<ProtectedRoute allowedRoles={["user"]}><Fasilitas /></ProtectedRoute>} />
                <Route path="/reservasi" element={<ProtectedRoute allowedRoles={["user"]}><Reservasi /></ProtectedRoute>} />
                <Route path="/review" element={<ProtectedRoute allowedRoles={["user"]}><Review /></ProtectedRoute>} />
                <Route path="/checkin" element={<ProtectedRoute allowedRoles={["user"]}><Checkin /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute allowedRoles={["user"]}><Checkout /></ProtectedRoute>} />
                
                {/* Admin Portal Routes */}
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/kamar" element={<ProtectedRoute allowedRoles={["admin"]}><DataKamar /></ProtectedRoute>} />
                <Route path="/admin/kamar/edit/:id" element={<ProtectedRoute allowedRoles={["admin"]}><EditKamar /></ProtectedRoute>} />
                <Route path="/admin/fasilitas" element={<ProtectedRoute allowedRoles={["admin"]}><DataFasilitas /></ProtectedRoute>} />
                <Route path="/admin/reservasi" element={<ProtectedRoute allowedRoles={["admin"]}><DataReservasi /></ProtectedRoute>} />
                <Route path="/admin/review" element={<ProtectedRoute allowedRoles={["admin"]}><DataReview /></ProtectedRoute>} />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;