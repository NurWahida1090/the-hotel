import api from "./api";

const authHeader = () => ({
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
});

export const getFacilities = async () => {
    const response = await api.get("/fasilitas");
    return response.data;
};

export const tambahFasilitas = async (data) => {
    const response = await api.post("/fasilitas", data, authHeader());
    return response.data;
};

export const editFasilitas = async (id, data) => {
    const response = await api.put(`/fasilitas/${id}`, data, authHeader());
    return response.data;
};

export const hapusFasilitas = async (id) => {
    const response = await api.delete(`/fasilitas/${id}`, authHeader());
    return response.data;
};