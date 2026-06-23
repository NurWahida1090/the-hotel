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