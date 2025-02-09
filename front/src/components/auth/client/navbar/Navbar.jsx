import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { faCartShopping, faBox } from "@fortawesome/free-solid-svg-icons"
import { NavUser } from "./NavUser"
import { BarsButton } from "./BarsButton"
import { useContext } from "react"
import { AuthContext } from "../../../../context/Auth/AuthContext"
import { AskForLogin } from "../../../AskForLogin"

export const Navbar = () => {
    const { isLogged } = useContext(AuthContext)

    return (
        <div className="duration-400 w-full z-50 sticky top-0 h-16 bg-zinc-900 border-b border-zinc-500 flex justify-between items-center">
            {/* Left */}
            <div className="duration-400 sm:w-2/5 w-5/5 h-full flex items-center gap-5">
                <div className="w-16 flex justify-end items-center">
                    <BarsButton />
                </div>
                <div className="h-10 flex justify-center items-center">
                    <Link to='/' className="h-10 flex justify-center items-center gap-2">
                        <img src="/Ecommerce.png" alt="logo" className="h-full" />
                        <p className="text-white text-2xl font-bold sm:block hidden">Ecommerce</p>
                    </Link>
                </div>
            </div>
            {/* Right */}
            <div className="w-3/5 text-white">
                <div className="h-full w-full xs:text-black flex justify-end items-center gap-5 px-3">
                    <div>
                        {
                            isLogged ?
                                <Link to='/my-orders' className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faBox} className="text-white text-xl" />
                                    <p className="sm:block hidden">
                                        Pedidos
                                    </p>
                                </Link>
                                :
                                <AskForLogin>
                                    <button className="flex items-center gap-2 cursor-pointer">
                                        <FontAwesomeIcon icon={faBox} className="text-white text-xl" />
                                        <p className="sm:block hidden">
                                            Pedidos
                                        </p>
                                    </button>
                                </AskForLogin>
                        }
                    </div>
                    <div>
                        {
                            isLogged ?
                                <Link to='/my-cart' className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCartShopping} className="text-white text-xl" />
                                    <p className="sm:block hidden">
                                        Carrito
                                    </p>
                                </Link>
                                :
                                <AskForLogin>
                                    <button className="flex items-center gap-2 cursor-pointer">
                                        <FontAwesomeIcon icon={faCartShopping} className="text-white text-xl" />
                                        <p className="sm:block hidden">
                                            Carrito
                                        </p>
                                    </button>
                                </AskForLogin>
                        }
                    </div>
                    <NavUser />
                </div>
            </div>
        </div>
    )
}
