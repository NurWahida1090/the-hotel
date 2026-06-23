import { Link } from "react-router-dom";

function Sidebar() {

    return (

        <div className="sidebar">

            <div className="logo">

                The Hotel

            </div>

            <div className="menu">

                <Link to="/admin/dashboard">

                    Dashboard

                </Link>

                <Link to="/admin/reservasi">

                    Data Reservasi

                </Link>

                <Link to="/admin/kamar">

                    Data Kamar

                </Link>

                <Link to="/admin/fasilitas">

                    Data Fasilitas

                </Link>

                <Link to="/admin/review">

                    Data Review

                </Link>

                <Link to="/">

                    Logout

                </Link>

            </div>

        </div>

    );

}

export default Sidebar;