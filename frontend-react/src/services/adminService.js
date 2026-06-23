import api from "./api";

export const getDashboard = async () => {
    const res = await api.get("/dashboard-admin", {
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("token"),
        },
    });

    return res.data;
};