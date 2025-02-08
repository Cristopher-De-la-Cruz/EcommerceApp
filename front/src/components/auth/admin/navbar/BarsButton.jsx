import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RenderWithAnimation } from "../../../RenderWithAnimation"
import { faBars, faBoxOpen, faDollarSign, faHome, faTags, faUser } from "@fortawesome/free-solid-svg-icons"
import { SideBarItem } from "../sidebar/SideBarItem"

export const BarsButton = () => {

    return (
        <>
            <RenderWithAnimation buttonClass="border-2 text-white rounded-md w-10 h-10 flex text-xl justify-center items-center cursor-pointer"
                buttonChildren={<FontAwesomeIcon icon={faBars} className="text-white" />}
                contClass="absolute duration-400 text-black w-xs text-white bg-zinc-900 left-0 top-16 transition-all ease-out transform"
                contStyle={{ height: 'calc(100vh - 4rem)' }}
                renderAnimationClass="opacity-100 translate-x-0 scale-100"
                exitAnimationClass="opacity-0 -translate-x-5 scale-95"
            >
                <div className={`duration-400 h-full max-h-full w-full overflow-y-scroll bar-scroll-dark py-1 px-2 flex flex-col gap-2`}>
                    <div className='py-1 px-2 border-b font-bold text-center'>
                        <h2>MENU</h2>
                    </div>
                    <SideBarItem isOpen={true} icon={faHome} text="Home" path='/admin' />
                    <SideBarItem isOpen={true} icon={faBoxOpen} text="Productos" path='/admin/productos' />
                    <SideBarItem isOpen={true} icon={faTags} text="Categorias" path='/admin/categorias' />
                    <SideBarItem isOpen={true} icon={faDollarSign} text="Ventas" path='/admin/ventas' />
                    <SideBarItem isOpen={true} icon={faUser} text="Usuarios" path='/admin/users' />
                </div>
            </RenderWithAnimation>
        </>
    )
}
