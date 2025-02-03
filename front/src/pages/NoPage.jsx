import { useContext, useEffect } from 'react'
import { ThemeContext } from '../context/Theme/ThemeContext'
import { AuthContext } from '../context/Auth/AuthContext';
import {Carrousel} from '../components/Carrousel'
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
export const NoPage = () => {
    const { toggleTheme } = useContext(ThemeContext)
    const { user } = useContext(AuthContext)
    console.log(user);

    useEffect(() => {
        document.title = 'Not Found';
    }, [])

    return (
        <div className="bg-gray-300 duration-500 dark:bg-gray-950 dark:text-white h-screen w-full overflow-auto flex flex-col gap-5 justify-center items-center">
            <h1 className="text-4xl font-bold">NOT FOUND 404</h1>
            <button className='duration-300 bg-zinc-500 hover:bg-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 hover:scale-125 text-white font-bold py-2 px-4 rounded-full' onClick={toggleTheme}>Toggle Theme</button>
            <Carrousel slides={slides} />
        </div>
    )
}
