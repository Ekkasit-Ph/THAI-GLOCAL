
import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/axiosClient";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarId?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: any) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null as User | null,

      login: async (userData: any) => {
        try {
          // POST directly to server so JWT Set-Cookie headers reach the browser
          const loginData = { usernameOrEmail: userData.email, password: userData.password };
          const response: any = await apiClient.post("/api/signin", loginData);
          // Server returns { userResponse: {...}, accessToken, refreshToken }
          const userResponse = response?.userResponse ?? response;
          set({
            isAuthenticated: true,
            user: { ...userResponse, id: String(userResponse.userId ?? userResponse.id) },
          });
        } catch (e: any) { console.error("Login failed", e); throw e; }
      },

      signup: async (userData: any) => {
         try {
            const signupData = {
              username: userData.username,
              email: userData.email,
              password: userData.password,
              role: (userData.role || "USER").toUpperCase()
            };
            const response = await apiClient.post("/api/signup", signupData);
            // Do not immediately authenticate after signup so the user is redirected to login
         } catch(e: any) {
            let errorMsg = "Registration failed. Please try again later.";
            if (e.code === "ECONNREFUSED" || e.code === "ERR_NETWORK" || e.message === "Network Error") {
                errorMsg = "Server is currently offline (Connection Refused).";
            } else if (e.response?.status === 500) {
                errorMsg = "Server is currently offline or encountered an error (500).";
            } else if (e.response?.data?.message) {
                errorMsg = e.response.data.message;
            } else if (typeof e.response?.data === 'string') {
                errorMsg = e.response.data;
            }
            console.error("SignUp Failed", e);
            throw new Error(errorMsg);
         }
      },
      updateProfile: async (userData: any) => {
        set((state) => ({ user: { ...state.user, ...userData } as User }));
      },
      logout: () => {
        alert("Logout triggered - Clearing Session");
        set({ isAuthenticated: false, user: null });
      },
      forgotPassword: async (email: string) => {
         try {
             await apiClient.post("/client/users/forget-password", { email });
             alert("Password reset check");
         } catch(e) {
             console.error("Forgot pass failed", e);
         }
      }
    }),
    {
      name: "tg_auth",
    }
  )
);

export default useAuthStore;



