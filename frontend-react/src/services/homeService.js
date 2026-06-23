import api from "./api";

export const getRooms = async () => {
    const res = await api.get("/kamar/home");
    return res.data;
};

export const getFacilities = async () => {
    const res = await api.get("/fasilitas");
    return res.data;
};

export const getReviews = async () => {
    const res = await api.get("/review");
    return res.data;
};