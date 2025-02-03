import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useContext } from 'react'
import { ThemeContext } from '../context/Theme/ThemeContext'


export const ThemeButton = () => {

    const { toggleTheme, theme } = useContext(ThemeContext)

    return (
        <>
            <button className="absolute top-3 left-5 text-black" onClick={toggleTheme}>
                <FontAwesomeIcon className={`duration-400 ${theme == 'dark' ? 'text-white' : 'text-black'} text-3xl cursor-pointer`} icon={theme == 'dark' ? faSun : faMoon} />
            </button>
        </>
    )
}