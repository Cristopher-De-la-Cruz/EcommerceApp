import { PropTypes } from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';

export const PageControl = ({ pagina, maxCount, limite, path='/' }) => {

    const navigate = useNavigate();
    const setPagina = (newPage) => {
        navigate(`${path}?page=${newPage}`);
    }

    return (
        <div className="flex sm:flex-row sm:justify-end sm:gap-2 flex-col justify-center sm:items-start items-center">
            <p>Estás en la página</p>


            <div className='flex gap-2 items-start'>
                {/* Botón para retroceder */}
                <button
                    disabled={pagina < 2}
                    onClick={() => pagina > 1 && setPagina(pagina - 1)}
                    className={`${pagina < 2 ? 'text-zinc-500 cursor-not-allowed' : 'cursor-pointer duration-200 hover:scale-115'}`}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {/* Botón para ir a la primera página (solo si el máximo es mayor que 1 y no estás ya en la primera página) */}
                {pagina > 1 && pagina > 4 && Math.ceil(maxCount / limite) > 1 && (
                    <>
                        <button
                            onClick={() => setPagina(1)}
                            className="hover:border cursor-pointer sm:w-7 w-5 rounded-md underline"
                        >
                            1
                        </button>
                        ...
                    </>
                )}

                {/* Números de las 3 páginas anteriores si existen */}
                {Array.from({ length: 3 }, (_, i) => pagina - 3 + i)
                    .filter(page => page > 0) // Solo páginas válidas
                    .map(page => (
                        <button
                            key={page}
                            onClick={() => setPagina(page)}
                            className={`${pagina === page ? '' : 'hover:border cursor-pointer sm:w-7 w-5 rounded-md underline'}`}
                        >
                            {page}
                        </button>
                    ))}

                {/* Página actual */}
                <p className="font-bold text-2xl">{pagina}</p>

                {/* Números de las 3 páginas posteriores si existen */}
                {Array.from({ length: 3 }, (_, i) => pagina + i + 1)
                    .filter(page => page <= Math.ceil(maxCount / limite)) // Solo páginas válidas
                    .map(page => (
                        <button
                            key={page}
                            onClick={() => setPagina(page)}
                            className={`${pagina === page ? '' : 'hover:border cursor-pointer sm:w-7 w-5 rounded-md underline'}`}
                        >
                            {page}
                        </button>
                    ))}


                {/* Botón para ir a la última página (solo si el máximo es mayor que 1 y no estás ya en la última página) */}
                {pagina < Math.ceil(maxCount / limite) && pagina < Math.ceil(maxCount / limite) - 3 && Math.ceil(maxCount / limite) > 1 && (
                    <>
                        ...
                        <button
                            onClick={() => setPagina(Math.ceil(maxCount / limite))}
                            className="hover:border cursor-pointer sm:w-7 w-5 rounded-md underline"
                        >
                            {Math.ceil(maxCount / limite)}
                        </button>
                    </>
                )}
                {/* Botón para avanzar */}
                <button
                    disabled={pagina >= Math.ceil(maxCount / limite)}
                    onClick={() => pagina < Math.ceil(maxCount / limite) && setPagina(pagina => pagina + 1)}
                    className={`${pagina >= Math.ceil(maxCount / limite) ? 'text-zinc-500 cursor-not-allowed' : 'cursor-pointer duration-200 hover:scale-115'}`}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>



        </div>
    )
}

PageControl.propTypes = {
    pagina: PropTypes.number,
    maxCount: PropTypes.number,
    limite: PropTypes.any,
    path: PropTypes.string,
}