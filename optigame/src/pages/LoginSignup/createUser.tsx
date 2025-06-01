import api from "../../services/api-client";

export const createUser = async (email: string, username: string, password: string) => {
  try {
    const response = await api.post("/v1/user", {
      email,
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.detail || "Registration failed";
  }
};