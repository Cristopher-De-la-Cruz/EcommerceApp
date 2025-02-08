import { useContext } from "react"
import { AuthContext } from "../../../context/Auth/AuthContext"
import { AdminLayout } from "../../../components/auth/admin/AdminLayout"

export const AdminHome = () => {
    const { logout } = useContext(AuthContext)
    return (
        <AdminLayout>
            <div>
                <p>AdminHome</p>
                <button onClick={logout}>Logout</button>
            </div>
        </AdminLayout>
    )
}
