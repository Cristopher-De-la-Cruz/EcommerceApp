import { PropTypes } from 'prop-types'
import { FilterContext } from "./FilterContext"
import Cookies from "js-cookie"
import { useState } from "react"

const initCategoria = {id: '', nombre: 'Todas las Categorías'};

export const FilterProvider = ({ children }) => {
    const [categoria, setCateg] = useState(() => {
            const categoriaCookie = Cookies.get('categoria');
            return categoriaCookie ? JSON.parse(categoriaCookie) : initCategoria;
        });
    const [limite, setLimit] = useState(Cookies.get('limite') || 12);

    const setCategoria = (categoria = initCategoria) => {
        setCateg({id: categoria.id, nombre: categoria.nombre});
        Cookies.set('categoria', JSON.stringify(categoria), { expires: 1/8 }); //Expira en 3 horas
    }
    const setLimite = (limite) => {
        setLimit(limite);
        Cookies.set('limite', limite, { expires: 1/8 }); //Expira en 3 horas
    }

    return (
        <FilterContext.Provider value={{categoria, setCategoria, limite, setLimite}}>
            {children}
        </FilterContext.Provider>
    )
}

FilterProvider.propTypes = {
    children: PropTypes.node,
}