import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropTypes } from 'prop-types'
import { useState, useContext } from 'react'
import { FilterContext } from '../../../../context/Filter/FilterContext';

export const CategoryFilter = ({ categories, category, setCategory, usingContext = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { categoria, setCategoria } = useContext(FilterContext);
    return (
        <div className='w-full'>
            <div onClick={() => setIsOpen(!isOpen)} className="text-lg font-medium cursor-pointer">
                <h3>Categoría <FontAwesomeIcon className='text-md' icon={isOpen ? faChevronDown : faChevronRight} /></h3>
            </div>
            {
                isOpen &&
                <div className='w-full max-h-50 overflow-auto'>
                    <div onClick={() => {!usingContext ? setCategory('') : setCategoria()}} className='flex gap-2 items-center hover:bg-slate-200 dark:hover:bg-zinc-700 cursor-pointer px-1'>
                        <div className={`h-3 w-3 border-2 rounded-full ${!usingContext ? category == '' && 'bg-cyan-400' : categoria.id == '' && 'bg-cyan-400'} `}></div>
                        <p>Todas las categorías</p>
                    </div>
                    {
                        categories.map(item => (
                            <div onClick={() => {!usingContext ? setCategory(item.id) : setCategoria({id: item.id, nombre: item.nombre})}} className='flex gap-2 items-center hover:bg-slate-200 dark:hover:bg-zinc-700 cursor-pointer px-1' key={item.id}>
                                <div className={`h-3 w-3 border-2 rounded-full ${!usingContext ? category == item.id && 'bg-cyan-400' : categoria.id == item.id && 'bg-cyan-400'} `}></div>
                                <p>{item.nombre}</p>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

CategoryFilter.propTypes = {
    categories: PropTypes.array,
    category: PropTypes.string,
    setCategory: PropTypes.func,
    usingContext: PropTypes.bool
}