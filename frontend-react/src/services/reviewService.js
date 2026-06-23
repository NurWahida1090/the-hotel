import api from "./api";

export const getReviews = async()=>{

    const response = await api.get("/review");

    return response.data;

}