import api from "./api";

const token = () => ({
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
});

export const getKamar = async () => {
    const res = await api.get("/kamar");
    return res.data;
};

export const tambahKamar = async (data) => {
    const res = await api.post("/kamar", data, token());
    return res.data;
};

export const editKamar = async (id, data) => {
    const res = await api.put(`/kamar/${id}`, data, token());
    return res.data;
};

export const hapusKamar = async (id) => {
    const res = await api.delete(`/kamar/${id}`, token());
    return res.data;
};

export const getKamarById = async (id) => {
    const res = await api.get(`/kamar`);
    return res.data.find(item => item.id_kamar == id);

};

export const updateKamar = async (id,data)=>{
    const res = await api.put(
        `/kamar/${id}`,
        data,
        token()
    );
    return res.data;
}