import React from "react"
import { Route, Redirect } from "react-router-dom"
import Landing from "./pages/Landing"
import CForm from "./pages/CForm"

const Routes: React.FC = () => {
  return (
    <div>
      <Route path='/' component={Landing} />
      <Route path='/cform' component={CForm} />
    </div>
  )
}

export default Routes
