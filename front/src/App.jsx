import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/login"
import { NoPage } from "./pages/NoPage"
import { AuthProvider } from "./context/Auth/AuthProvider"
import { FilterProvider } from "./context/Filter/FilterProvider"
import { Home } from "./pages/Auth/Client/Home"
import { AdminHome } from "./pages/Auth/Admin/AdminHome"
import { Register } from "./pages/Register"
import { ProductShow } from "./pages/Auth/Client/ProductShow"
import { ToastProvider } from "./context/Toast/ToastProvider"

export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <FilterProvider>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/Register" element={<Register />} />
              <Route path="*" element={<NoPage />} />
              {/* Client */}
              <Route path="/" element={<Home />} />
              <Route path="/product/:nombreId" element={<ProductShow />} />
              <Route path="/admin" element={<AdminHome />} />
            </Routes>
          </AuthProvider>
        </FilterProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

