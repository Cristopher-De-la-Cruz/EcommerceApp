import { AdminPage } from "./AdminPage"
import { PropTypes } from 'prop-types'
import { Navbar } from "./navbar/Navbar"
import { Sidebar } from "./sidebar/Sidebar"
import { useEffect } from "react"

export const AdminLayout = ({children, title = 'Ecommerce'}) => {

    useEffect(() => {
        if (document.title != 'Not Found') document.title = title;
    }, [title]);


    return (
        <AdminPage>
            <div className="duration-400 bg-slate-100 dark:bg-zinc-900 text-black dark:text-white h-screen w-full overflow-auto">
                {/* Navbar */}
                <Navbar/>
                {/* Body */}
                <div className="w-full flex">
                    {/* Sidebar */}
                    <Sidebar/>
                    {/* Body */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </AdminPage>
    )
}

AdminLayout.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
}