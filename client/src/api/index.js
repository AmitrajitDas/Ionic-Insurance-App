import axios from "axios"

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API}`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    let res = error.response
    console.error(res.status)
    return Promise.reject(error)
  }
)

export default api
