import { PropTypes } from 'prop-types';
import { Carrousel } from './Carrousel';
import { useState } from 'react';
import { AddToCarButton } from './AddToCarButton';
import { CarCantControl } from './Carrito/CarCantControl';



export const ProductShowBody = ({ producto, fetchAgain }) => {
    const [showDescription, setShowDescription] = useState(false);
    const productImgs = producto.imagenes.map((img, index) => ({
        id: index,
        title: producto.nombre,
        image: img.imagen,
    }));

    console.log(producto);
    return (
        <div className='w-full grid md:grid-cols-2 grid-cols-1 gap-4 py-5'>
            <div className='flex justify-center items-center py-3'>
                <div className='w-[90%]  flex justify-center items-center py-3 max-h-lg'>
                    <Carrousel slides={productImgs} height='h-120' width='w-full' />
                </div>
            </div>
            <div className='flex justify-center py-3'>
                <div className='w-[90%] flex flex-col justify-around gap-3'>
                    <div className='word-break break-all flex flex-col gap-2'>
                        <h1 className='text-4xl font-bold border-b'>{producto.nombre}</h1>
                        <div
                            onClick={() => setShowDescription((showDescription) => !showDescription)}
                            className={`overflow-${showDescription ? 'auto' : 'hidden'} duration-400 cursor-pointer max-h-30`}
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: showDescription ? null : 3,
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            <p>{producto?.descripcion}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <p>Categoría:</p>
                        <p className='font-semibold'>{producto.categoria}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <p>Stock Disponible:</p>
                        <p className={`${producto.stock > 0 ? 'text-green-500' : 'text-red-500'} text-3xl font-medium`}>{producto.stock}</p>
                    </div>
                    <div>
                        <p className='text-4xl text-red-600 font-semibold'>S/.{producto.precio}</p>
                    </div>
                    <div className='truncate flex gap-3'>
                        {
                            producto.imagenes.map((img, index) => (
                                <img className='h-40 object-cover rounded-md' key={index} src={img.imagen} alt={producto.nombre} />
                            ))
                        }
                    </div>
                    <div>
                        {
                            producto.carrito == false ? <AddToCarButton producto={producto} fetchAgain={fetchAgain} />
                            : <CarCantControl carrito_id={producto.carrito.id} defaultCant={producto.carrito.cantidad} maxCant={producto.stock} fetchAgain={fetchAgain} />
                        }
                        
                    </div>

                </div>

            </div>
        </div>
    );
};

ProductShowBody.propTypes = {
    producto: PropTypes.object.isRequired,
    fetchAgain: PropTypes.func,
};
