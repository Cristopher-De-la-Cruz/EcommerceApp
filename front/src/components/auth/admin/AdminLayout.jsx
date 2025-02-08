import { AdminPage } from "./AdminPage"
import { PropTypes } from 'prop-types'
import { Navbar } from "./navbar/Navbar"
import { Sidebar } from "./sidebar/Sidebar"

export const AdminLayout = ({children}) => {
    return (
        <AdminPage>
            <div className="duration-400 bg-slate-100 dark:bg-zinc-900 text-black dark:text-white h-screen w-full overflow-auto">
                {/* Navbar */}
                <Navbar/>
                {/* Body */}
                <div className="w-full flex h-full">
                    {/* Sidebar */}
                    <Sidebar/>
                    {/* Body */}
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </AdminPage>
    )
}

AdminLayout.propTypes = {
    children: PropTypes.node
}