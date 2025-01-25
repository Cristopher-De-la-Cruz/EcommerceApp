import { useContext } from 'react'
import { ThemeContext } from './context/ThemeContext'
function App() {

  const { toggleTheme } = useContext(ThemeContext)

  return (
    <>
      <div className="bg-gray-200 dark:bg-gray-800 dark:text-white h-screen w-full overflow-auto flex justify-center items-center">
          <button className='bg-zinc-500 hover:bg-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded-full' onClick={toggleTheme}>Toggle Theme</button>
      </div>
    </>
  )
}

export default App
