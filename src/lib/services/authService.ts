import apiClient from "../apiClient";

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>("/auth/login", { email, password });
      return response;
    } catch (error: any) {
      // Don't log authentication errors to avoid console popups
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, preferences: string[]): Promise<RegisterResponse> => {
    try {
      const response = await apiClient.post<RegisterResponse>("/auth/signup", {
        name,
        email,
        password,
        preferences,
      });
      return response;
    } catch (error: any) {
      // Don't log authentication errors to avoid console popups
      throw error;
    }
  },
};
