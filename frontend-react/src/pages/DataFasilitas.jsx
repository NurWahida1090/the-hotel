import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

function DataFasilitas() {
    return (
        <>
            <Sidebar />
            <div className="main">
                <Topbar />
                <h1>Data Fasilitas</h1>
            </div>
        </>
    );
}

export default DataFasilitas;