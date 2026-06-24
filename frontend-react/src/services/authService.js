import api from "./api";

export const loginUser = async (username, password) => {

    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const response = await api.post(
        "/login",
        formData,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data;
};

export const registerUser = async (data) => {

    const response = await api.post(
        "/register",
        data
    );

    return response.data;
};

const authHeader = () => ({
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
    },
});

export const updateProfile = async (data) => {
    const response = await api.put("/me", data, authHeader());
    return response.data;
};