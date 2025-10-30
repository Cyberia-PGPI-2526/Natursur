import { create } from "zustand"

export const useAuthStore = create((set) => ({
    token: null,
    userId: null,
    role: null,

    login: (data) => {
        set({
            token: data.token,
            userId: data.userId,
            role: data.role,
        })
    },

    logout: () => {
        set({
            token: null,
            userId: null,
            role: null,
        })
    }
}))