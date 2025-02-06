import { PropTypes } from 'prop-types'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faX } from '@fortawesome/free-solid-svg-icons';
import { CarCantControl } from './CarCantControl';
import { Link } from 'react-router-dom';
import apiRoutes from '../../services/apiRoutes';
import { useApi } from '../../hooks/useApi';
import { useContext } from 'react';
import { AuthContext } from '../../context/Auth/AuthContext';
import { ToastContext } from '../../context/Toast/ToastContext';

export const AddToCarButton = ({ producto, fetchAgain }) => {
    const [isOpen, setisOpen] = useState(false);
    const [carrito_id, setCarritoId] = useState(0);
    const { fetchApi } = useApi();
    const { token } = useContext(AuthContext);
    const { toast, theme } = useContext(ToastContext);

    const addToCar = async () => {
        const response = await fetchApi(apiRoutes.carrito.store, 'POST', JSON.stringify({ producto_id: producto.id, cantidad: 1 }), token);
        if (response.success) {
            setisOpen(true);
            setCarritoId(response.body.carrito_id);
        } else {
            toast.error(response.body.message || 'Error al agregar al carrito', { position: 'bottom-right', theme: theme });
        }
    };

    const close = () => {
        setisOpen(false);
        fetchAgain();
    }


    return (
        <>
            {
                producto.stock > 0 ? 
                <button disabled={isOpen}
                    onClick={() => {
                        addToCar(); // Aquí puedes manejar la lógica del botón
                    }}
                    className="duration-400 w-full border-1 font-bold border-red-700 rounded-full cursor-pointer text-red-700 hover:bg-red-700 hover:text-white p-2"
                >
                    AGREGAR
                </button>
                :
                <h2 className='w-full text-center text-2xl font-bold text-red-600'>AGOTADO</h2>
            }
            {
                isOpen &&
                <div className='duration-400 flex flex-col justify-around absolute min-h-60 lg:left-1/4 left-5 right-5 top-1/3 z-20 rounded-lg duration-400 border-2 border-black dark:border-white text-black bg-slate-100 w-[90%] lg:w-1/2 dark:text-white dark:bg-zinc-900 transition-all ease-out transform'>
                    <div className='h-15 relative flex justify-center items-center'>
                        <p className='text-lg font-bold text-green-600 flex items-center gap-2'><FontAwesomeIcon icon={faCheckCircle} /> Has agregado este producto a tu carrito</p>
                        <button className='absolute top-0 right-0 p-2 text-black dark:text-white hover:text-gray-500 cursor-pointer text-md cursor-pointer'>
                            <FontAwesomeIcon icon={faX} onClick={() => close()} />
                        </button>
                    </div>
                    <div className='h-20 flex justify-around items-center'>
                        <div className='h-full'>
                            <img className='h-full object-cover rounded-md' src={producto.imagenes[0].imagen} alt={producto.nombre} />
                        </div>
                        <div>
                            <p className='text-xl font-bold'>{producto.nombre}</p>
                        </div>
                        <div>
                            <p className='text-xl font-bold'>S/.{producto.precio}</p>
                        </div>
                        <div className='w-32'>
                            <CarCantControl carrito_id={carrito_id} product_name={producto.nombre} maxCant={producto.stock} fetchAgain={fetchAgain} />
                        </div>
                    </div>
                    <div className='h-20 flex justify-around items-center'>
                        <button onClick={() => close()} className='border-2 border-red-800 rounded-full py-1 px-2 cursor-pointer duration-400 hover:bg-red-800 font-medium text-md h-13 w-[45%] flex justify-center items-center hover:text-white hover:scale-105'>Seguir Comprando</button>
                        <Link className='border-2 border-red-800 rounded-full py-1 px-2 cursor-pointer duration-400 hover:bg-red-800 font-medium text-md h-13 w-[45%] flex justify-center items-center hover:text-white hover:scale-105' to='my-cart'>Ir al Carrito</Link>
                    </div>
                </div>
            }
        </>
    )
}

AddToCarButton.propTypes = {
    producto: PropTypes.object.isRequired,
    fetchAgain: PropTypes.func,
}