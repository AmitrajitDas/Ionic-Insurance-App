import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useHistory, useLocation } from "react-router-dom"
import * as authApi from "../api/auth"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
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

  const signup = (email) => {
    setLoading(true)

    authApi
      .signup(email)
      .then((user) => {
        console.log("API func call", user)
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  const verifySignup = (
    otp,
    firstName,
    middleName,
    lastName,
    email,
    age,
    location,
    occupation,
    password
  ) => {
    setLoading(true)

    authApi
      .verifySignup(
        otp,
        firstName,
        middleName,
        lastName,
        email,
        age,
        location,
        occupation,
        password
      )
      .then((user) => {
        setUser(user)
        console.log("API func call", user)
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  function login(email, password) {
    setLoading(true)

    authApi
      .login(email, password)
      .then((user) => {
        setUser(user)
        console.log("API func call", user)
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  function logout() {
    authApi.logout().then(() => setUser(undefined))
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      signup,
      verifySignup,
      login,
      logout,
    }),
    [user, loading, error]
  )

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
