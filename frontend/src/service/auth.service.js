import { useAuthStore } from "../store/authStore"
import { api } from "./api"

export const loginUser = async (loginData) => {
    try {
        const response = await api.post('/auth/login', loginData)
        return response.data
    } catch (error) {
        console.error(error)
        return {error: 'Invalid credentials' }
    }
}

export const registerUser = async (registerData) => {
    try {
        const response = await api.post('/auth/register', registerData)
        return response.data
    } catch (error) {
        console.error(error)
        return {error: 'Registration failed' }
    }
}

export const refreshToken = async () => {
    try {
        console.log("Ejecutando refresh")
        const response = await api.post('/auth/refresh')
        console.log(response)
        useAuthStore.getState()
            .login({
                token: response.data.token,
                userId: response.data.userId,
                role: response.data.role,
            })
        return response.data
    } catch (error) {
        useAuthStore.getState().logout()
        console.error(error)
    }
}

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout')
        useAuthStore.getState().logout()
        return response.data
    } catch (error) {
        console.error(error)
        useAuthStore.getState().logout()
    }
}

export const validateToken = async () => {
    try {
        const response = await api.get('/auth/validate')
        return response.data
    } catch (error) {
        console.error(error)
    }
}