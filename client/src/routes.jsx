import React from "react"
import { Route, Redirect } from "react-router-dom"
import Header from "./components/Header"
import Landing from "./pages/Landing"
import MyForm from "./pages/CForm"
import useAuth from "./context/useAuth"

const Routes = () => {
  const { data, user, loading, error, signup, verifySignup, login, logout } =
    useAuth()

  return (
    <>
      <Route path='/' exact={true}>
        <Header>
          <Landing />
        </Header>
      </Route>
      <Route path='/cform/:name' exact={true}>
        <Header>
          <MyForm
            data={{
              data,
              user,
              loading,
              error,
              signup,
              verifySignup,
              login,
              logout,
            }}
          />
        </Header>
      </Route>
    </>
  )
}

export default Routes
