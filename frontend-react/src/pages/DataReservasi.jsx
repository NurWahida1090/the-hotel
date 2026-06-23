import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

function DataReservasi() {
    return (
        <>
            <Sidebar />
            <div className="main">
                <Topbar />
                <h1>Data Reservasi</h1>
            </div>
        </>
    );
}

export default DataReservasi;