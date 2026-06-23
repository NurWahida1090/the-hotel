import api from "./api";

export const getRooms = async()=>{

    const response = await api.get("/kamar");

    return response.data;

}