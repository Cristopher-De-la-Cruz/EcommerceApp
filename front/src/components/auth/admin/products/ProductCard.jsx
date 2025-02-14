import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PropTypes } from 'prop-types'
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import { EditProductButton } from './EditProductButton';
import apiRoutes from '../../../../services/apiRoutes';
import { useApi } from '../../../../hooks/useApi';
import { AuthContext } from '../../../../context/Auth/AuthContext';
import { ToastContext } from '../../../../context/Toast/ToastContext';

export const ProductCard = ({ producto, fetchAgain, categories }) => {
    const [product, setProduct] = useState(producto)

    const { token } = useContext(AuthContext);
    const { toast, theme } = useContext(ToastContext);
    const { fetchApi, isLoading } = useApi();

    const toggleState = async() => {
        try{
            const response = await fetchApi(`${apiRoutes.productos.toggleState}${producto.id}`, 'PUT', null, token);
            if(response.success){
                fetchAgain()
                toast.success(response.body.message, {position: "bottom-right", theme: theme})
            } else {
                if(response.status == 400){
                    response.body.forEach(error => {
                        toast.error(error.message, {position: "bottom-right", theme: theme})
                    })
                } else{
                    toast.error(response.body.message, {position: "bottom-right", theme: theme})
                }
            }
        } catch(error) {
            console.error(error)
            toast.error('Ha ocurrido un error al cambiar el estado.', {position: "bottom-right", theme: theme})
        }
    }
    

    useEffect(() => {
        setProduct(producto);
    }, [producto]);

    return (
        <div
            title={product.descripcion}
            className="hover:shadow-lg shadow-zinc-400 dark:shadow-zinc-950 rounded-xl pb-2">
            {/* Imagen */}
            <div>
                <img
                    className="w-full h-60 rounded-t-xl md:object-cover object-center"
                    src={product?.imagenes[0]?.imagen}
                    alt={product.nombre}
                />
            </div>
            {/* Info */}
            <div className="py-3 px-2 flex flex-col gap-2">
                <div className="text-center text-xl flex justify-start gap-2">
                    <button disabled={isLoading} onClick={toggleState} title={product.estado == 1 ? 'Inactivar?' : 'Activar?'} 
                        className={`top-0 right-0 h-7 w-7 min-w-7 rounded-full border-2 ${product.estado == 1 ? 'bg-green-500' : 'bg-red-600'} cursor-pointer`}>
                    </button>
                    <h2 title={product?.nombre} className="truncate w-full text-center">{product?.nombre}</h2>
                </div>
                <div
                    className="text-sm h-10 overflow-hidden text-ellipsis"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    <p>{product?.descripcion}</p>
                </div>
                <div className="text-md flex justify-start items-end gap-1 truncate">
                    <p className='font-semibold'>Categoría: </p>
                    <p className='text-lg font-bold'>{product?.categoria}</p>
                </div>
                <div className="text-md flex justify-start items-end gap-1 truncate">
                    <p className='font-semibold'>Stock: </p>
                    <p className='text-xl text-blue-600 font-semibold'>{product?.stock}</p>
                </div>
                <div className="text-md flex justify-start items-end gap-1 truncate">
                    <p className='font-semibold'>Precio: </p>
                    <p className='text-2xl text-red-600 font-semibold'>S/.{product?.precio}</p>
                </div>
                <div className="text-md flex justify-start items-end gap-1 truncate">
                    <p className='font-semibold'>Creado: </p>
                    <p className='text-lg font-bold'>{new Date(product?.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-md flex justify-start items-end gap-1 truncate">
                    <p className='font-semibold'>Editado: </p>
                    <p className='text-lg font-bold'>{new Date(product?.updated_at).toLocaleDateString()}</p>
                </div>
            </div>
            <div className='w-full grid grid-cols-2 gap-2 py-1 px-2'>
                <EditProductButton producto={producto} fetchAgain={fetchAgain} categories={categories} />
                <Link className="duration-400 w-full font-semibold cursor-pointer border-2 border-cyan-400 py-1 px-2 rounded-2xl hover:scale-105 hover:text-cyan-400 flex justify-center items-center gap-1"
                    to={`/admin/producto/${producto.nombre}-${producto.id}/imagenes`}>
                    <FontAwesomeIcon icon={faImage} /> Imágenes
                </Link>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    producto: PropTypes.object,
    fetchAgain: PropTypes.func,
    categories: PropTypes.array
};
