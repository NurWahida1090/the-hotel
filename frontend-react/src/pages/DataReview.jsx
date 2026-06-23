import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

function DataReview() {
    return (
        <>
            <Sidebar />
            <div className="main">
                <Topbar />
                <h1>Data Review</h1>
            </div>
        </>
    );
}

export default DataReview;