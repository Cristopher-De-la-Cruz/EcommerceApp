import { Link } from "react-router-dom"
import { RenderWithAnimation } from "./RenderWithAnimation"
import { PropTypes } from "prop-types"

export const AskForLogin = ({children}) => {
    return (
        <RenderWithAnimation buttonChildren={children} 
            contClass="duration-600 absolute z-50 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black bg-zinc-300 dark:bg-zinc-950 w-xs dark:text-white transition-all ease-out p-4 rounded-xl shadow-2xl shadow-zinc-500 dark:shadow-black"
            renderAnimationClass="opacity-100 scale-100"
            exitAnimationClass="opacity-0 -translate-y-30 scale-80"
            closeButton={true}
            >
                <div className="w-full h-full flex justify-center items-center">
                    <div className="w-5/6 flex flex-col gap-3 justify-around">
                        <div className="text-center">
                            <h3 className="font-bold text-3xl">Inicia Sesión para continuar</h3>
                        </div>
                        <div className="w-full flex justify-center items-center">
                            <Link className="duration-400 w-[90%] h-10 border-2 rounded-2xl hover:scale-105 dark:border-cyan-400 dark:hover:text-cyan-400 border-blue-700 hover:text-blue-700 hover:text-lg flex justify-center items-center" to='/login'>Iniciar Sesión</Link>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm">¿No tienes una cuenta registrada?</p>
                            <Link className="duration-400 w-[90%] h-10 border-2 rounded-2xl hover:scale-105 border-rose-500 hover:text-rose-500 hover:text-lg flex justify-center items-center" to='/register'>Registrar Cuenta</Link>
                        </div>
                    </div>

                </div>
        </RenderWithAnimation>
    )
}

AskForLogin.propTypes = {
    children: PropTypes.node.isRequired,
}