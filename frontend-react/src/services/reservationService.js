import api from "./api";

const authHeader = () => ({
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
});

// Get all reservations for current user
export const getMyReservations = async () => {
    const res = await api.get("/reservasi-saya", authHeader());
    return res.data;
};

// Create a new reservation
export const createReservation = async (data) => {
    const res = await api.post("/reservasi", data, authHeader());
    return res.data;
};

// Cancel/delete a reservation
export const cancelReservation = async (id) => {
    const res = await api.delete(`/reservasi/${id}`, authHeader());
    return res.data;
};
