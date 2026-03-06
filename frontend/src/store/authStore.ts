import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  address?: string;
}

interface AuthState {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<UserProfile, "id" | "email">>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      login: async (emailOrUsername, password) => {
        if (!emailOrUsername || !password) throw new Error("Email/username and password are required.");
        if (password.length < 6) throw new Error("Invalid credentials.");

        const stored = localStorage.getItem("tg_users");
        const users: (UserProfile & { password: string })[] = stored ? JSON.parse(stored) : [];
        const q = emailOrUsername.toLowerCase();
        const found = users.find(
          (u) => u.email.toLowerCase() === q || (u.username ?? "").toLowerCase() === q
        );
        if (!found || found.password !== password) throw new Error("Invalid email/username or password.");

        const { password: _pw, ...profile } = found;
        set({ user: profile });
      },

      signup: async (email, password) => {
        if (!email || !password) throw new Error("All fields are required.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");

        const stored = localStorage.getItem("tg_users");
        const users: (UserProfile & { password: string })[] = stored ? JSON.parse(stored) : [];
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error("An account with this email already exists.");
        }

        const newUser: UserProfile & { password: string } = {
          id: crypto.randomUUID(),
          email,
          password,
        };
        users.push(newUser);
        localStorage.setItem("tg_users", JSON.stringify(users));

        const { password: _pw, ...profile } = newUser;
        set({ user: profile });
      },

      logout: () => set({ user: null }),

      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...data };
        set({ user: updated });

        // Persist updated profile back to users list
        const stored = localStorage.getItem("tg_users");
        if (stored) {
          const users: (UserProfile & { password: string })[] = JSON.parse(stored);
          const idx = users.findIndex((u) => u.id === current.id);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...data };
            localStorage.setItem("tg_users", JSON.stringify(users));
          }
        }
      },
    }),
    { name: "tg_auth" }
  )
);

export default useAuthStore;
