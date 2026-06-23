import api from "./api";

export const getFacilities = async()=>{

    const response = await api.get("/fasilitas");

    return response.data;

}