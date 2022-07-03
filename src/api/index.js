import axios from "axios"

// axios.defaults.withCredentials = true
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API}`,
  withCrendentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    let res = error.response
    console.error(res.status)
    return Promise.reject(error)
  }
)

export default api
