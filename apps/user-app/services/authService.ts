import apiClient from "../apiClient";

export const signupService = (
  name: string,
  email: string,
  password: string
) => {
  return apiClient.post("/api/signup", { name, email, password });
};

export const loginService = (email: string, password: string) => {
  return apiClient.post("/api/login", { email, password });
};