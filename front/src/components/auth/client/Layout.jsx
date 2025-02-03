import { ClientPage } from "./ClientPage"
import { useEffect } from "react"
import PropTypes from "prop-types"
import { Navbar } from "./navbar/Navbar"

export const Layout = ({ children, title }) => {

    useEffect(() => {
        if (document.title != 'Not Found') document.title = title;
    }, [title]);

    return (
        <ClientPage>
            <div className="duration-400 bg-slate-100 dark:bg-zinc-900 text-black dark:text-white h-screen w-full overflow-auto">
                {/* Navbar */}
                <Navbar/>
                {/* Body */}
                <div>
                    {children}
                </div>
            </div>
        </ClientPage>
    )
}

Layout.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
}