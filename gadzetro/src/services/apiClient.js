import axios from 'axios'

// Central Axios client for the future Spring Boot API. In the mock phase the *Service.js files do not call it yet.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// Later (backend phase): attach the JWT in a request interceptor. No token is sent in this mock phase.

// Normalise errors so pages always receive { status, message }.
apiClient.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject({
      status: error.response?.status ?? 0,
      message: error.response?.data?.message || error.message || 'Something went wrong',
    })
)

export default apiClient
