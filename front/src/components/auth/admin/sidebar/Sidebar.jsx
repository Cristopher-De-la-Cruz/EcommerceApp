import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleRight, faAngleDoubleLeft, faHome, faTags, faBoxOpen, faDollarSign, faUser } from "@fortawesome/free-solid-svg-icons"
import { SideBarItem } from "./SideBarItem"
import Cookies from "js-cookie"

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(Cookies.get('isSidebarOpen') === 'true')

    const toggleSidebar = () => {
        setIsOpen((isOpen) => !isOpen)
        Cookies.set('isSidebarOpen', !isOpen)
    }

    return (
        <div style={{ height: 'calc(100vh - 4rem)' }} className={`duration-400 ${isOpen ? 'w-60' : 'w-12'} bg-zinc-900 text-white border-r border-zinc-500 sticky sm:block hidden top-16`}>
            <div className={`duration-400 flex ${isOpen ? 'justify-between px-2' : 'justify-center'} items-center gap-2 h-9`}>
                {
                    isOpen &&
                    <p className="font-bold text-lg">Menu</p>
                }
                <button className="cursor-pointer text-xl h-full" onClick={() => toggleSidebar()}>
                    <FontAwesomeIcon icon={isOpen ? faAngleDoubleLeft : faAngleDoubleRight} />
                </button>
            </div>
            <SideBarItem isOpen={isOpen} icon={faHome} text="Home" path='/admin' />
            <SideBarItem isOpen={isOpen} icon={faBoxOpen} text="Productos" path='/admin/productos' />
            <SideBarItem isOpen={isOpen} icon={faTags} text="Categorias" path='/admin/categorias' />
            <SideBarItem isOpen={isOpen} icon={faDollarSign} text="Ventas" path='/admin/ventas' />
            <SideBarItem isOpen={isOpen} icon={faUser} text="Usuarios" path='/admin/users' />
        </div>
    )
}
