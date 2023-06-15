import { Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Private from "./Private"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"
import Customers from "../pages/Customers"
import Profile from "../pages/Profile"
import New from "../pages/New"
function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <Private>
            <Dashboard />
          </Private>
        }
      />
      <Route
        path="/customers"
        element={
          <Private>
            <Customers />
          </Private>
        }
      />
      <Route
        path="/profile"
        element={
          <Private>
            <Profile />
          </Private>
        }
      />
      <Route
        path="/new"
        element={
          <Private>
            <New />
          </Private>
        }
      />
      <Route
        path="/new/:id"
        element={
          <Private>
            <New />
          </Private>
        }
      />
    </Routes>
  )
}

export default RoutesApp
