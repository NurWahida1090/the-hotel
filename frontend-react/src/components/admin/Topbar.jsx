function Topbar() {

    const username =
        localStorage.getItem("username");

    return (

        <div className="topbar">

            <h2>

                Dashboard Admin

            </h2>

            <div className="profile">

                <img
                    src="https://i.pravatar.cc/100"
                />

                <div>

                    <h4>

                        {username}

                    </h4>

                    <small>

                        Administrator

                    </small>

                </div>

            </div>

        </div>

    );
}

export default Topbar;