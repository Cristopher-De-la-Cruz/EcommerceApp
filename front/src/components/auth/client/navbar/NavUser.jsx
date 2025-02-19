import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faUser, faSignIn, faSignOut, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../../context/Auth/AuthContext";
import { ThemeContext } from "../../../../context/Theme/ThemeContext";
import { ToastContext } from "../../../../context/Toast/ToastContext";
import { Link } from "react-router-dom";
import { RenderWithAnimation } from "../../../RenderWithAnimation";
import { MyAccountButton } from "../../../account/MyAccountButton";

export const NavUser = () => {
    const { user, logout, isLogged } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { toast } = useContext(ToastContext);

    const handleLogout = () => {
        const logoutResponse = logout();
        if (logoutResponse.success) {
            toast.success(logoutResponse.message, { position: "bottom-right", theme: theme });
        } else {
            toast.error(logoutResponse.message, { position: "bottom-right", theme: theme });
        }
        //Recargar la página si no es redirigido
        // window.location.reload();
    }


    return (
        <>
            <RenderWithAnimation contClass="absolute text-white dark:text-black right-2 top-12 transition-all ease-out transform"
                renderAnimationClass="opacity-100 translate-y-0 scale-100"
                exitAnimationClass="opacity-0 -translate-y-5 scale-95"
                buttonChildren={
                    <div className="flex items-center text-md gap-1 cursor-pointer">
                        <div className="h-8 w-8 rounded-full text-black flex justify-center items-center font-bold text-lg bg-yellow-500">
                            <p>{user.nombre.charAt(0).toUpperCase() || "?"}</p>
                        </div>
                        <div title={user.nombre} className="truncate max-w-30 sm:block hidden">{user.nombre}</div>
                        <div>
                            <FontAwesomeIcon icon={faChevronDown} className="text-white text-xs font-bold" />
                        </div>
                    </div>}
            >
                <>
                    <div className="flex justify-end w-full h-3 relative">
                        {/* Forma triangular */}
                        <div
                            className="duration-400 absolute right-1 top-[3px]"
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
                        {
                            !isLogged &&
                            <Link to="/login">
                                <div className="w-[98%] hover:text-gray-500 py-1 border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2">
                                    <FontAwesomeIcon icon={faSignIn} /> <p>Iniciar Sesión</p>
                                </div>
                            </Link>
                        }
                        {
                            !isLogged &&
                            <Link to="/register">
                                <div className="w-[98%] hover:text-gray-500 py-1 border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2">
                                    <FontAwesomeIcon icon={faUser} /> <p>Registrar Cuenta</p>
                                </div>
                            </Link>
                        }
                        {
                            isLogged &&
                            <MyAccountButton/>
                        }
                        <button
                            onClick={toggleTheme}
                            className="w-[98%] hover:text-gray-500 py-1 cursor-pointer border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2"
                        >
                            <FontAwesomeIcon icon={theme === "light" ? faSun : faMoon} />
                            <p>Cambiar Tema</p>
                        </button>
                        {
                            isLogged &&
                            <button onClick={handleLogout} className="w-full cursor-pointer">
                                <div className="w-[98%] hover:text-gray-500 py-1 border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2">
                                    <FontAwesomeIcon icon={faSignOut} /> <p>Cerrar Sesión</p>
                                </div>
                            </button>
                        }
                    </div>
                </>
            </RenderWithAnimation>

        </>
    );
};
