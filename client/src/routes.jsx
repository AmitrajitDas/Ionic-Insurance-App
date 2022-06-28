import React from "react"
import { Route, Redirect } from "react-router-dom"
import Landing from "./pages/Landing"
import CForm from "./pages/CForm"
import useAuth from "./context/useAuth"

const Routes = () => {
  const { user, loading, error, signup, verifySignup, login, logout } =
    useAuth()

  return (
    <div>
      <Route path='/' component={Landing} />
      <Route
        path='/cform'
        component={() => (
          <CForm
            props={{
              user,
              loading,
              error,
              signup,
              verifySignup,
              login,
              logout,
            }}
          />
        )}
      />
    </div>
  )
}

export default Routes
