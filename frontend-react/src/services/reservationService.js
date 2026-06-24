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

// Admin: Get all reservations
export const getAllReservations = async () => {
    const res = await api.get("/reservasi", authHeader());
    return res.data;
};

// Admin: Update status of a reservation
export const updateReservationStatus = async (id, status) => {
    const res = await api.put(`/reservasi/status/${id}`, { status_reservasi: status }, authHeader());
    return res.data;
};
