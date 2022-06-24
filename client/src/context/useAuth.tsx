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

interface AuthContextType {
  user?: any
  loading: boolean
  error?: any
  signup: (email: string) => void
  verifySignup: (
    otp: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    age: number,
    location: string,
    occupation: string,
    password: string
  ) => void
  login: (email: string, password: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const [user, setUser] = useState<any>()
  const [error, setError] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true)

  const history = useHistory()
  const location = useLocation()

  // If we change page, reset the error state.
  useEffect(() => {
    if (error) setError(null)
  }, [location.pathname, error])

  const signup = (email: string) => {
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
    otp: string,
    firstName: string,
    middleName: string,
    lastName: string,
    email: string,
    age: number,
    location: string,
    occupation: string,
    password: string
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
        history.push("/")
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))
  }

  function login(email: string, password: string) {
    setLoading(true)

    authApi
      .login(email, password)
      .then((user) => {
        setUser(user)
        history.push("/")
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
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  )
}

export default function useAuth() {
  return useContext(AuthContext)
}
