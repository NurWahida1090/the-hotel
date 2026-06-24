import { useEffect, useState } from "react";

import "../assets/css/admin.css";

import { getDashboard } from "../services/adminService";

import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import HeroAdmin from "../components/admin/HeroAdmin";
import StatisticCard from "../components/admin/StatisticCard";

function AdminDashboard() {

    const [dashboard, setDashboard] = useState({

        statistik: {},

        reservasi: [],

        kamar: [],

        fasilitas: [],

        review: []

    });

    useEffect(() => {
        const loadDashboard = async () => {

            const data =
                await getDashboard();

            setDashboard(data);

        };

        loadDashboard();
    }, []);

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
