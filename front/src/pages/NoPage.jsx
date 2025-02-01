import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import {Carrousel} from '../components/Carrousel'

export const NoPage = () => {
    const { toggleTheme } = useContext(ThemeContext)
    const slides = [
        {
          id: 1,
          image: 'https://via.placeholder.com/600x300?text=Slide+1',
          title: 'Slide 1',
          description: 'Descripción de la diapositiva 1',
        },
        {
          id: 2,
          image: 'https://via.placeholder.com/600x300?text=Slide+2',
          title: 'Slide 2',
          description: 'Descripción de la diapositiva 2',
        },
        {
          id: 3,
          image: 'https://via.placeholder.com/600x300?text=Slide+3',
          description: 'Descripción de la diapositiva 3',
        },
      ];

    return (
        <div className="bg-gray-300 duration-500 dark:bg-gray-950 dark:text-white h-screen w-full overflow-auto flex flex-col gap-5 justify-center items-center">
            <h1 className="text-4xl font-bold">NOT FOUND 404</h1>
            <button className='duration-300 bg-zinc-500 hover:bg-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 hover:scale-125 text-white font-bold py-2 px-4 rounded-full' onClick={toggleTheme}>Toggle Theme</button>
            <Carrousel slides={slides} />
        </div>
    )
}
