import { Link } from "react-router-dom"
import { NavUser } from "../../client/navbar/NavUser"
import { BarsButton } from "../navbar/BarsButton"

export const Navbar = () => {
    return (
        <div className="duration-400 w-full z-50 sticky top-0 h-16 bg-zinc-900 border-b border-zinc-500 flex justify-between items-center">
            {/* Left */}

            <div className="duration-400 sm:w-2/5 w-5/5 h-full flex items-center gap-5">
                <div className="h-10 flex justify-center items-center px-3 gap-2">
                    <div className="sm:hidden block">
                        <BarsButton/>
                    </div>
                    <Link to='/admin' className="h-10 flex justify-center items-center gap-2">
                        <img src="/Ecommerce.png" alt="logo" className="h-full" />
                        <p className="text-white text-2xl font-bold sm:block hidden">Ecommerce</p>
                        <p className="text-white text-2xl font-bold">Admin</p>
                    </Link>
                </div>
            </div>
            {/* Right */}
            <div className="w-3/5 text-white">
                <div className="h-full w-full xs:text-black flex justify-end items-center gap-5 px-3">
                    <NavUser />
                </div>
            </div>
        </div>
    )
}
