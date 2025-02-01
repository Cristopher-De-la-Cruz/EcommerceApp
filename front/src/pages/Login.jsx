import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { Carrousel } from '../components/Carrousel'


const slides = [
    {
        id: 1,
        image: 'https://www.esic.edu/sites/default/files/rethink/ba73d6a3-ecommerce.jpg',
        title: 'Ecommerce App',
    },
    {
        id: 2,
        image: 'https://d1ih8jugeo2m5m.cloudfront.net/2022/07/el-ecommerce-que-es.jpg',
        title: 'El ecommerce que es',
    },
    {
        id: 3,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxfbHqRcIJyfetk-m8WL-ImiUPITWjcB9rhw&s',
        title: 'Al alcance de un click',
    },
];

export const Login = () => {
    const { toggleTheme, theme } = useContext(ThemeContext)

    return (
        <>
            <div className="h-screen w-full overflow-auto flex dark:text-white">
                <div className="duration-400 w-3/5 h-full bg-slate-100 dark:bg-zinc-900 flex justify-center items-center">
                    <div className="duration-400 w-md h-[32rem] bg-white dark:bg-zinc-700 shadow-2xl rounded-xl py-5 flex justify-center">
                        <div className="w-5/6 flex flex-col justify-around">
                            {/* Header */}
                            <div>
                                <p className="text-gray-400 font-bold">¡Bienvenido de vuelta!</p>
                                <h1 className="font-bold text-4xl">Inicia Sesión</h1>
                            </div>
                            {/* Body */}
                            <div className="flex flex-col gap-5">
                                <div>
                                    <p>Email</p>
                                    <input type="text"
                                        className="bg-transparent border-2 rounded-md py-1 px-2 w-full" />
                                </div>
                                <div>
                                    <p>Contraseña</p>
                                    <input type="password"
                                        className="bg-transparent border-2 rounded-md py-1 px-2 w-full" />
                                </div>
                                {/* <div className="flex justify-center items-center gap-2">
                                    <p className="text-xs">Mantener Sesión</p>
                                    <input type="checkbox" />
                                </div> */}
                                <div className="flex justify-center">
                                    <button className="duration-300 w-3/4 text-white bg-zinc-950 hover:scale-115 ease-out cursor-pointer font-bold border-2 border-black py-1.5 px-3 rounded-full">Iniciar Sesión</button>
                                </div>
                            </div>
                            {/* Foot */}
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-sm">¿No tienes una cuenta registrada?</p>
                                <button className="duration-300 w-3/4 text-white bg-zinc-950 hover:scale-115 ease-out cursor-pointer font-bold border-2 border-black py-1.5 px-3 rounded-full">Registrate</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="duration-400 w-2/5 h-full bg-red-100 dark:bg-zinc-950 flex flex-col justify-center gap-10 py-15">
                    <div className='text-center'>
                        <h1 className='text-5xl font-bold'>Ecommerce App</h1>
                        <p className='text-sm'>Comercio electrónico al alcance de todos</p>
                    </div>
                    {/* Carrousel */}
                    <div className='w-full flex justify-center items-center'>
                        <div className='w-5/6'>
                            <Carrousel slides={slides} />
                        </div>
                    </div>
                    {/* opacidad .5 */}
                    {/* <img src="https://www.esic.edu/sites/default/files/rethink/ba73d6a3-ecommerce.jpg" alt="ecommerce" className="w-full h-full opacity-[80%] object-cover" /> */}
                </div>
            </div>
            {/* Absolute */}
            <button className="absolute top-3 left-5 text-black" onClick={toggleTheme}>
                <FontAwesomeIcon className={`duration-400 ${theme == 'dark' ? 'text-white' : 'text-black'} text-3xl cursor-pointer`} icon={theme == 'dark' ? faSun : faMoon} />
            </button>
        </>
    )
}
