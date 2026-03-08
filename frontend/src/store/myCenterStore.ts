
import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/axiosClient";

export interface UserCenter { [key: string]: any; }
export interface UserWorkshop { [key: string]: any; }
export interface UserSession { [key: string]: any; }
export interface UserBooking { [key: string]: any; }

interface MyCenterState {
  myCenters: UserCenter[];
  myWorkshops: UserWorkshop[];
  mySessions: UserSession[];
  myBookings: UserBooking[];

  centers: UserCenter[];
  workshops: UserWorkshop[];
  sessions: UserSession[];

  fetchMyCenterData: (ownerId: string) => Promise<void>;

  createCenter: (userId: string, data: any) => Promise<void>;
  updateCenter: (id: string, data: any) => Promise<void>;
  deleteCenter: (id: string) => Promise<void>;

  createWorkshop: (centerId: string, data: any) => Promise<void>;
  updateWorkshop: (id: string, data: any) => Promise<void>;
  deleteWorkshop: (id: string) => Promise<void>;
  updateWorkshopStatus?: any;

  createSession: (workshopId: string, data: any) => Promise<void>;
  updateSession: (id: string, data: any) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;

  addCenterAdmin: (centerId: string, userId: string) => Promise<void>;
  addCenterStaff: (centerId: string, userId: string) => Promise<void>;

  updateBookingStatus: (id: string, status: string) => Promise<void>;
  requestCancelBooking: (id: string, requestedBy: string) => Promise<void>;     
  approveCancelBooking: (id: string) => Promise<void>;
}

const useMyCenterStore = create<MyCenterState>()(
  persist(
    (set) => ({
      myCenters: [],
      myWorkshops: [],
      mySessions: [],
      myBookings: [],
      centers: [],
      workshops: [],
      sessions: [],

      fetchMyCenterData: async (ownerId) => {
        try {
          const [cen, work, sess] = await Promise.allSettled([
            apiClient.get(`/client/centers`),
            apiClient.get(`/client/workshops`),
            apiClient.get(`/client/activities`)
          ]);
          set({
            myCenters: cen.status === "fulfilled" ? cen.value as any : [],      
            myWorkshops: work.status === "fulfilled" ? work.value as any : [],  
            mySessions: sess.status === "fulfilled" ? sess.value as any : []    
          });
        } catch (e) {
          console.error(e);
        }
      },

      createCenter: async (userId: string, data: any) => {
        await apiClient.post(`/client/centers/create/user/${userId}`, data);
      },
      updateCenter: async (id, data) => {
        await apiClient.patch(`/client/centers/update/${id}`, data);
      },
      deleteCenter: async (id) => {
        await apiClient.delete(`/client/centers/delete/${id}`);
      },

      createWorkshop: async (centerId, data: any) => {
        await apiClient.post(`/client/workshops/create`, { ...data, centerId });
      },
      updateWorkshop: async (id, data) => {
        await apiClient.patch(`/client/workshops/update/${id}`, data);
      },
      deleteWorkshop: async (id) => {
        await apiClient.delete(`/client/workshops/delete/${id}`);
      },

      createSession: async (workshopId, data: any) => {
         await apiClient.post(`/client/activities/workshop/${workshopId}/create`, data);
      },
      updateSession: async (id, data) => {
        await apiClient.patch(`/client/activities/update/${id}`, data);
      },
      deleteSession: async (id) => {
        await apiClient.delete(`/client/activities/delete/${id}`);
      },

      addCenterAdmin: async (centerId: string, userId: string) => {
        await apiClient.post(`/client/centers/${centerId}/add-admin/${userId}`);
      },
      addCenterStaff: async (centerId: string, userId: string) => {
        await apiClient.post(`/client/centers/${centerId}/add-staff/${userId}`);
      },

      updateBookingStatus: async (id, status) => {
        console.warn("Feature Coming Soon");
        alert("Booking handling Feature Coming Soon");
      },
      requestCancelBooking: async (id, requestedBy) => {
        console.warn("Feature Coming Soon");
        alert("Booking handling Feature Coming Soon");
      },
      approveCancelBooking: async (id) => {
        console.warn("Feature Coming Soon");
        alert("Booking handling Feature Coming Soon");
      }
    }),
    { name: "tg_mycenter" }
  )
);

export default useMyCenterStore;

