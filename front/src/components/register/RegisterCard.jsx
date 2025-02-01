import { Link } from "react-router-dom"
import { RegisterForm } from "./RegisterForm"

export const RegisterCard = () => {
    return (
        <>
            <div className="duration-400 w-md h-[32rem] bg-white dark:bg-zinc-700 shadow-2xl rounded-xl py-5 flex justify-center">
                <div className="w-5/6 flex flex-col justify-around">
                    <div>
                        <p className="text-gray-400 font-bold">¡Nos alegra que te unas!</p>
                        <h1 className="font-bold text-4xl">Registrar una cuenta</h1>
                    </div>
                    {/* Form */}
                    <RegisterForm/>

                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm">¿Ya tienes una cuenta registrada?</p>
                        <Link to="/login" className="duration-300 w-3/4 text-white bg-zinc-950 hover:scale-115 ease-out cursor-pointer font-bold border-2 border-black py-1.5 px-3 rounded-full text-center">Inicia Sesión</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
