import { create } from "zustand";
import apiClient from "../api/axiosClient";
import type { Activity, Center } from "../data/mockData";

interface DataState {
  workshops: Activity[];
  activities: Activity[];
  centers: Center[];
  fetchData: () => Promise<void>;
  isLoading: boolean;
}

const useDataStore = create<DataState>((set) => ({
  workshops: [],
  activities: [],
  centers: [],
  isLoading: false,
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const [wRes, cRes] = await Promise.allSettled([
        apiClient.get("/client/workshops"),
        apiClient.get("/client/centers"),
      ]);
      set({
        workshops: wRes.status === "fulfilled" && Array.isArray(wRes.value) ? wRes.value : [],
        activities: wRes.status === "fulfilled" && Array.isArray(wRes.value) ? wRes.value : [],
        centers: cRes.status === "fulfilled" && Array.isArray(cRes.value) ? cRes.value : [],
        isLoading: false
      });
    } catch (error) {
      console.error("Failed to fetch public data", error);
      set({ isLoading: false });
    }
  },
}));
export default useDataStore;
