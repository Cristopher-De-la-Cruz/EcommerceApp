import { PropTypes } from 'prop-types'
export const ProductCard = ({ producto, watchOnly = true }) => {
    return (
        <div title={producto.descripcion} className='hover:shadow-lg shadow-zinc-400 dark:shadow-zinc-950 rounded-xl cursor-pointer '>
            {/* Imagen */}
            <div>
                <img className='w-full h-60 rounded-t-xl md:object-cover object-center' src={producto.imagenes[0].imagen} alt={producto.nombre} />
            </div>
            {/* Info */}
            <div className='py-3 px-2 flex flex-col gap-2'>
                <div className='text-center text-xl'>
                    <h2>{producto?.nombre}</h2>
                </div>
                <div className="text-sm h-10 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    <p>{producto?.descripcion}</p>
                </div>
                <div className='text-2xl text-red-600 font-bold'>
                    <p>S/.{producto?.precio}</p>
                </div>
                {
                    !watchOnly &&
                    <div className='w-full'>
                        <button className='duration-400 w-full border-1 font-bold border-red-700 rounded-full cursor-pointer text-red-700 hover:bg-red-700 hover:text-white p-2'>AGREGAR</button>
                    </div>
                }
            </div>
        </div>
    )
}

ProductCard.propTypes = {
    producto: PropTypes.object,
    watchOnly: PropTypes.bool,
}