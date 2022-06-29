import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { isPlatform } from "@ionic/react"
import { Storage } from "@capacitor/storage"
import { useHistory, useLocation } from "react-router-dom"
import api from "../api"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [data, setData] = useState()
  const [user, setUser] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)

  const history = useHistory()
  const location = useLocation()

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null)
  }, [location.pathname, error])

  const signup = (data) => {
    setLoading(true)
    api
      .post("/signup", JSON.stringify(data))
      .then((user) => {
        setData(user.data)
        console.log("signup", user.data)
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  const verifySignup = (data) => {
    setLoading(true)
    api
      .post("/verify/user", JSON.stringify(data))
      .then((user) => {
        setData(user.data.data.token)
        console.log("verify signup", user.data.data.token)
        if (isPlatform("hybrid"))
          Storage.set({ key: "token", value: user.data.data.token })
        else localStorage.setItem("token", JSON.stringify(user.data.data.token))
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  const login = (data) => {
    setLoading(true)
    api
      .post("/login/create-session", JSON.stringify(data))
      .then((user) => {
        setUser(user.data.data.user)
        console.log("login", user.data.data.user)
        if (isPlatform("hybrid"))
          Storage.set({ key: "user", value: user.data.data.user })
        else sessionStorage.setItem("user", JSON.stringify(user.data.data.user))
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  function logout() {
    api.get("/logout").then(() => setUser(undefined))
  }

  const memoedValue = useMemo(
    () => ({
      data,
      user,
      loading,
      error,
      signup,
      verifySignup,
      login,
      logout,
    }),
    [data, user, loading, error]
  )

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
