import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/login"
import { NoPage } from "./pages/NoPage"
import { AuthProvider } from "./context/Auth/AuthProvider"
import { Home } from "./pages/Auth/Client/home"
import { AdminHome } from "./pages/Auth/Admin/AdminHome"
import { Register } from "./pages/Register"

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="*" element={<NoPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminHome />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

