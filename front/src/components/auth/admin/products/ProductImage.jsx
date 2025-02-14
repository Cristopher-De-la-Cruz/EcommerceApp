import { faMinusCircle, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropTypes } from 'prop-types';
import apiRoutes from '../../../../services/apiRoutes';
import { useApi } from '../../../../hooks/useApi';
import { useContext } from 'react';
import { ToastContext } from '../../../../context/Toast/ToastContext';
import { AuthContext } from '../../../../context/Auth/AuthContext';

export const ProductImage = ({ imagen, fetchAgain }) => {

    const { fetchApi } = useApi();
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    
    const handleClick = async(action) => {
        try{
            let route = `${apiRoutes.productos.inactiveImage}${imagen.id}`;
            let method = 'PUT';
            if (action == 'activate'){
                route = `${apiRoutes.productos.reactiveImage}${imagen.id}`;
            } else if (action == 'delete'){
                route = `${apiRoutes.productos.deleteImage}${imagen.id}`;
                method = 'DELETE';
            }
            const response = await fetchApi(route, method, null, token);
            if(response.success){
                fetchAgain();
            } else {
                if(response.status == 400 ){
                    response.body.forEach(error => {
                        toast.error(error.message, { position: 'bottom-right', theme: theme });
                    });
                } else {
                    toast.error(response.body.message, { position: 'bottom-right', theme: theme });
                }
            }
        } catch(error){
            console.error(error);
            toast.error('Error al inactivar', { position: 'bottom-right', theme: theme });
        }
    }
    

    return (
        <div className='w-full h-full relative z-10 text-black'>
            <img
                src={imagen?.imagen}
                alt={imagen?.nombre || 'Image'}
                className="w-full h-full object-cover"
            />
            {/* Absolutes */}
            <div className='absolute top-2 right-3 flex gap-2 items-center'>
                {/* If estado is true, then you can innactivate the image */}
                {
                    imagen.estado === 1 &&
                    <button onClick={() => handleClick('inactivate')} title='Inactivar' className='duration-400 rounded-full cursor-pointer text-2xl text-red-600 hover:scale-120'>
                        <FontAwesomeIcon className='duration-400 hover:shadow-md shadow-black hover:bg-black rounded-full' icon={faMinusCircle} />
                    </button>
                }

                {/* If estado is false, then you can re activate the image or delete it */}
                {
                    imagen.estado === 0 &&
                    <button onClick={() => handleClick('activate')} title='activar' className='duration-400 rounded-full cursor-pointer text-2xl text-indigo-700 hover:scale-120'>
                        <FontAwesomeIcon className='duration-400 hover:shadow-md shadow-black hover:bg-black rounded-full' icon={faPlusCircle} />
                    </button>
                }
                {
                    imagen.estado === 0 &&
                    <button onClick={() => handleClick('delete')} title='delete' className='duration-400 rounded-full cursor-pointer text-2xl text-red-600 hover:scale-120'>
                        <FontAwesomeIcon className='duration-400 hover:shadow-xl shadow-black rounded-full' icon={faTrash} />
                    </button>
                }
            </div>
        </div>
    )
}

ProductImage.propTypes = {
    imagen: PropTypes.object,
    fetchAgain: PropTypes.func,
}