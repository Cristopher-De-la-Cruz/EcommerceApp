import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./pages/login"
import { NoPage } from "./pages/NoPage"

export const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NoPage />} />
        </Routes>
    </BrowserRouter>
  )
}

