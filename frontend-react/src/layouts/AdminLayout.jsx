import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

function AdminLayout({ children }) {
    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>

                <Topbar />

                <div style={{ padding: "30px" }}>
                    {children}
                </div>

            </div>

        </div>
    );
}

export default AdminLayout;