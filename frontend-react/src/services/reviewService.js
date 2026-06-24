import api from "./api";

const authHeader = () => ({
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
});

// Get all public reviews
export const getReviews = async () => {
    const res = await api.get("/review");
    return res.data;
};

// Get my reviews
export const getMyReviews = async () => {
    const res = await api.get("/review-saya", authHeader());
    return res.data;
};

// Post a new review
export const createReview = async (data) => {
    const res = await api.post("/review", data, authHeader());
    return res.data;
};

// Delete a review
export const deleteReview = async (id) => {
    const res = await api.delete(`/review/${id}`, authHeader());
    return res.data;
};