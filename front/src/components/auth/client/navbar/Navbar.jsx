import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faCartShopping, faBox } from "@fortawesome/free-solid-svg-icons"
import { NavUser } from "./NavUser"
import { BarsButton } from "./BarsButton"

export const Navbar = () => {
    return (
        <div className="duration-400 w-full sticky top-0 h-16 bg-red-800 flex justify-between items-center">
            {/* Left */}
            <div className="duration-400 sm:w-2/5 w-5/5 h-full flex items-center gap-5">
                <div className="w-16 flex justify-end items-center">
                    <BarsButton/>
                </div>
                <div className="h-10 flex justify-center items-center">
                    <Link to='/' className="text-white text-2xl font-bold">Ecommerce</Link>
                </div>
            </div>
            {/* Right */}
            <div className="w-3/5 text-white">
                <div className="h-full w-full xs:text-black flex justify-end items-center gap-5 px-3">
                    <div>
                        <Link to='/mis-pedidos' className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBox} className="text-white text-xl" />
                            <p className="sm:block hidden">
                                Pedidos
                            </p>
                        </Link>
                    </div>
                    <div>
                        <Link to='/mi-carrito' className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCartShopping} className="text-white text-xl" />
                            <p className="sm:block hidden">
                                Carrito
                            </p>
                        </Link>
                    </div>
                    <NavUser />
                </div>
            </div>
        </div>
    )
}
