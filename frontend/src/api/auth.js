import api from "./axiosInstance";

const logoutUser = () => api.get("/logout");
const signupUser = (userData) => api.post("/signup", userData);
const loginUser = (credentials) => api.post("/login", credentials);

export { logoutUser, signupUser, loginUser };
