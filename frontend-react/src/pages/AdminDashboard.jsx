import { useEffect, useState } from "react";

import "../assets/css/admin.css";

import { getDashboard } from "../services/adminService";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import HeroAdmin from "../components/admin/HeroAdmin";
import StatisticCard from "../components/admin/StatisticCard";
import ReservasiTable from "../components/admin/ReservasiTable";
import RoomAdmin from "../components/admin/RoomAdmin";
import FacilityAdmin from "../components/admin/FacilityAdmin";
import ReviewAdmin from "../components/admin/ReviewAdmin";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState({

        statistik: {},

        reservasi: [],

        kamar: [],

        fasilitas: [],

        review: []

    });

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        const data =
            await getDashboard();

        setDashboard(data);

    };

    return (
        <>
        <Sidebar />
        <div className="main">
        <Topbar />
        <HeroAdmin />
        <StatisticCard
        statistik={dashboard.statistik}
        />
        </div>
        </>
        )

}

export default AdminDashboard;