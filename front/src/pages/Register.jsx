import { useContext, useEffect } from 'react'
import { ThemeContext } from '../context/Theme/ThemeContext'
import { AuthContext } from '../context/Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { Carrousel } from '../components/Carrousel'
import { RegisterCard } from '../components/register/RegisterCard';
import { useNavigate } from 'react-router-dom';


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

export const Register = () => {
    const { toggleTheme, theme } = useContext(ThemeContext)
    const { isLogged } = useContext(AuthContext)
    const navigate = useNavigate();
    useEffect(() => {
        if(isLogged){
            navigate('/')
        }
    }, [isLogged, navigate])

    return (
        <>
            <div className="h-screen w-full overflow-auto flex dark:text-white">
                
                <div className="duration-400 w-3/5 h-full bg-slate-100 dark:bg-zinc-900 flex justify-center items-center">
                    {/* Login Card */}
                    <RegisterCard/>
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
                </div>
            </div>
            {/* Absolute */}
            <button className="absolute top-3 left-5 text-black" onClick={toggleTheme}>
                <FontAwesomeIcon className={`duration-400 ${theme == 'dark' ? 'text-white' : 'text-black'} text-3xl cursor-pointer`} icon={theme == 'dark' ? faSun : faMoon} />
            </button>
        </>
    )
}
