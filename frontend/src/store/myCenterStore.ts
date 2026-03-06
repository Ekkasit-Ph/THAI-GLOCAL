import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserCenter {
  id: string;
  ownerId: string;
  name: string;
  nameTh: string;
  location: string;
  province: string;
  description: string;
  image: string;
  tags: string[];
}

export interface UserWorkshop {
  id: string;
  centerId: string;
  ownerId: string;
  title: string;
  titleTh: string;
  category: string;
  description: string;
  image: string;
  duration: string;
  maxParticipants: number;
  price: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructor: string;
  whatYouLearn: string[];
  tags: string[];
}

export interface UserSession {
  id: string;
  workshopId: string;
  centerId: string;
  ownerId: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:MM"
  endTime: string;     // "HH:MM"
  maxParticipants: number;
  notes: string;
  status: "upcoming" | "full" | "cancelled" | "completed";
}

interface MyCenterState {
  centers: UserCenter[];
  workshops: UserWorkshop[];
  sessions: UserSession[];
  // Center
  createCenter: (data: Omit<UserCenter, "id">) => UserCenter;
  updateCenter: (id: string, data: Partial<Omit<UserCenter, "id" | "ownerId">>) => void;
  deleteCenter: (id: string) => void;
  // Workshop
  createWorkshop: (data: Omit<UserWorkshop, "id">) => UserWorkshop;
  updateWorkshop: (id: string, data: Partial<Omit<UserWorkshop, "id" | "centerId" | "ownerId">>) => void;
  deleteWorkshop: (id: string) => void;
  // Session
  createSession: (data: Omit<UserSession, "id">) => UserSession;
  updateSession: (id: string, data: Partial<Omit<UserSession, "id" | "workshopId" | "centerId" | "ownerId">>) => void;
  deleteSession: (id: string) => void;
  // Queries
  getCenterByOwner: (ownerId: string) => UserCenter | undefined;
  getWorkshopsByCenter: (centerId: string) => UserWorkshop[];
  getWorkshopById: (id: string) => UserWorkshop | undefined;
  getSessionsByWorkshop: (workshopId: string) => UserSession[];
}

const useMyCenterStore = create<MyCenterState>()(
  persist(
    (set, get) => ({
      centers: [],
      workshops: [],
      sessions: [],

      createCenter: (data) => {
        const center: UserCenter = { ...data, id: crypto.randomUUID() };
        set((s) => ({ centers: [...s.centers, center] }));
        return center;
      },

      updateCenter: (id, data) =>
        set((s) => ({
          centers: s.centers.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),

      deleteCenter: (id) =>
        set((s) => ({
          centers: s.centers.filter((c) => c.id !== id),
          workshops: s.workshops.filter((w) => w.centerId !== id),
        })),

      createWorkshop: (data) => {
        const workshop: UserWorkshop = { ...data, id: crypto.randomUUID() };
        set((s) => ({ workshops: [...s.workshops, workshop] }));
        return workshop;
      },

      updateWorkshop: (id, data) =>
        set((s) => ({
          workshops: s.workshops.map((w) => (w.id === id ? { ...w, ...data } : w)),
        })),

      deleteWorkshop: (id) =>
        set((s) => ({
          workshops: s.workshops.filter((w) => w.id !== id),
          sessions: s.sessions.filter((ss) => ss.workshopId !== id),
        })),

      createSession: (data) => {
        const session: UserSession = { ...data, id: crypto.randomUUID() };
        set((s) => ({ sessions: [...s.sessions, session] }));
        return session;
      },

      updateSession: (id, data) =>
        set((s) => ({
          sessions: s.sessions.map((ss) => (ss.id === id ? { ...ss, ...data } : ss)),
        })),

      deleteSession: (id) =>
        set((s) => ({ sessions: s.sessions.filter((ss) => ss.id !== id) })),

      getCenterByOwner: (ownerId) => get().centers.find((c) => c.ownerId === ownerId),

      getWorkshopsByCenter: (centerId) =>
        get().workshops.filter((w) => w.centerId === centerId),

      getWorkshopById: (id) => get().workshops.find((w) => w.id === id),

      getSessionsByWorkshop: (workshopId) =>
        get().sessions
          .filter((ss) => ss.workshopId === workshopId)
          .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)),
    }),
    { name: "tg_my_center" }
  )
);

export default useMyCenterStore;
