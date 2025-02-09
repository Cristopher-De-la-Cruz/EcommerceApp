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
import { Carrito } from "./pages/Auth/Client/Carrito"
import { Compra } from "./pages/Auth/Client/Compra"
import { MyOrders } from "./pages/Auth/Client/MyOrders"
import { OrderPage } from "./pages/Auth/Client/OrderPage"
import { AdminProducts } from "./pages/Auth/Admin/AdminProducts"
import { AdminCategories } from "./pages/Auth/Admin/AdminCategories"
import { AdminSales } from "./pages/Auth/Admin/AdminSales"
import { AdminUsers } from "./pages/Auth/Admin/AdminUsers"

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
              <Route path="/my-cart" element={<Carrito />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/my-order/:id" element={<OrderPage />} />
              <Route path="/buy" element={<Compra />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/productos" element={<AdminProducts />} />
              <Route path="/admin/categorias" element={<AdminCategories />} />
              <Route path="/admin/ventas" element={<AdminSales />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Routes>
          </AuthProvider>
        </FilterProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

