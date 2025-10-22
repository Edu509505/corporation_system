import { create } from "zustand"

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface UseStore {
    token: string | null;
    setToken: (token: string) => void;
    user: User | null
    setUser: (user: User | null) => void
}

export const useUser = create<UseStore>((set) => ({
    token: null,
    setToken: (token: string) => set({ token }),
    user: {
        id: 0,
        email: "",
        name: "",
        role: "adm"
    },
    setUser: (user: User | null) => set({ user })
}))