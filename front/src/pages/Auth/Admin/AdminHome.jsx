import { AdminPage } from "../../../components/auth/admin/AdminPage"
import { useContext } from "react"
import { AuthContext } from "../../../context/Auth/AuthContext"

export const AdminHome = () => {
    const { logout } = useContext(AuthContext)
    return (
        <AdminPage>
            <div>
                <p>AdminHome</p>
                <button onClick={logout}>Logout</button>
            </div>
        </AdminPage>
    )
}
