import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faUser, faSignOut, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../../context/Auth/AuthContext";
import { ThemeContext } from "../../../../context/Theme/ThemeContext";
import { Link } from "react-router-dom";
import { RenderWithAnimation } from "../../../RenderWithAnimation";

export const NavUser = () => {
    const [isOpen, setIsOpen] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);


    return (
        <>
            <RenderWithAnimation contClass="absolute  text-white dark:text-black right-2 top-10 transition-all ease-out transform"
                renderAnimationClass="opacity-100 translate-y-0 scale-100"
                exitAnimationClass="opacity-0 -translate-y-5 scale-95"
                buttonChildren={
                    <div onClick={() => setIsOpen(!isOpen)} className="flex items-center text-md gap-1 cursor-pointer">
                        <div className="h-8 w-8 rounded-full text-black flex justify-center items-center font-bold text-lg bg-yellow-500">
                            <p>{user.nombre.charAt(0).toUpperCase()}</p>
                        </div>
                        <div title={user.nombre} className="truncate max-w-30 sm:block hidden">{user.nombre}</div>
                        <div>
                            <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="text-white text-xs font-bold" />
                        </div>
                    </div>}
            >
                <>
                    <div className="flex justify-end w-full h-3 relative">
                        {/* Forma triangular */}
                        <div
                            className="absolute right-4 bottom-0"
                            style={{
                                width: 0,
                                height: 0,
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderBottom: `10px solid ${theme === "light" ? "black" : "white"}`,
                            }}
                        ></div>
                    </div>
                    <div className="duration-400 bg-black dark:bg-white w-50 rounded-md py-2.5 px-1 flex flex-col gap-2">
                        <div className="w-[98%] py-1 text-md px-2">
                            <p className="truncate" title={`¡BIENVENIDO ${user.nombre.toUpperCase()}!`}>¡BIENVENIDO {user.nombre.toUpperCase()}!</p>
                        </div>
                        <Link to="/MyAccount">
                            <div className="w-[98%] hover:text-gray-500 py-1 border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2">
                                <FontAwesomeIcon icon={faUser} /> <p>Mi Perfil</p>
                            </div>
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="w-[98%] hover:text-gray-500 py-1 cursor-pointer border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2"
                        >
                            <FontAwesomeIcon icon={theme === "light" ? faSun : faMoon} />
                            <p>Cambiar Tema</p>
                        </button>
                        <button onClick={logout} className="w-full cursor-pointer">
                            <div className="w-[98%] hover:text-gray-500 py-1 border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2">
                                <FontAwesomeIcon icon={faSignOut} /> <p>Cerrar Sesión</p>
                            </div>
                        </button>
                    </div>
                </>
            </RenderWithAnimation>

        </>
    );
};
