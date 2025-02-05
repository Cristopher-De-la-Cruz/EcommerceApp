import { PropTypes } from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { AddToCarButton } from './AddToCarButton';
import { CarCantControl } from './Carrito/CarCantControl';

export const ProductCard = ({ producto, watchOnly = true, fetchAgain }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/product/${producto.nombre}-${producto.id}`);
    };

    const stopPropagation = (e) => {
        e.stopPropagation(); // Previene que el clic en el botón o sus hijos active la redirección
    };

    return (
        <div
            onClick={handleCardClick}
            title={producto.descripcion}
            className="hover:shadow-lg shadow-zinc-400 dark:shadow-zinc-950 rounded-xl cursor-pointer"
        >
            {/* Imagen */}
            <div>
                <img
                    className="w-full h-60 rounded-t-xl md:object-cover object-center"
                    src={producto.imagenes[0].imagen}
                    alt={producto.nombre}
                />
            </div>
            {/* Info */}
            <div className="py-3 px-2 flex flex-col gap-2">
                <div className="text-center text-xl">
                    <h2 className="truncate">{producto?.nombre}</h2>
                </div>
                <div
                    className="text-sm h-10 overflow-hidden text-ellipsis"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    <p>{producto?.descripcion}</p>
                </div>
                <div className="text-2xl text-red-600 font-bold">
                    <p>S/.{producto?.precio}</p>
                </div>
                {!watchOnly && (
                    <button className="w-full" onClick={stopPropagation}>
                        {producto.carrito === false ? (
                            <AddToCarButton producto={producto} onClick={stopPropagation} fetchAgain={fetchAgain} />
                        ) : (
                            <CarCantControl
                                carrito_id={producto.carrito.id}
                                maxCant={producto.stock}
                                defaultCant={producto.carrito.cantidad}
                                fetchAgain={fetchAgain}
                                onClick={stopPropagation}
                            />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    producto: PropTypes.object,
    watchOnly: PropTypes.bool,
    fetchAgain: PropTypes.func,
};
