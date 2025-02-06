import { CarCantControl } from "./CarCantControl"
import { PropTypes } from 'prop-types'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLink, faTrash } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import { InactiveProductCart } from "./InactiveProductCart"

export const ProductCart = ({product, fetchAgain}) => {
    return (
        <>
            <div className="w-full lg:max-h-3 min-h-30 grid lg:grid-cols-6 grid-cols-1 lg:border-0 lg:p-0 p-3 border-2 rounded-lg relative lg:gap-0 gap-2">
                <div className="lg:h-30 lg:max-h-30 lg:max-w-30 h-50 truncate overflow-hidden flex justify-center items-center">
                    <img className='h-full object-cover rounded-md' src={product.imagen} alt={product.nombre} />
                </div>
                <div className="h-full flex flex-col justify-center items-center text-center lg:gap-2 gap-0">
                    <p>Producto: </p>
                    <p className="text-lg font-medium word-break">{product.nombre}</p>
                </div>
                <div className="h-full flex flex-col justify-center items-center lg:gap-2 gap-0">
                    <p>Precio: </p>
                    <p className="text-xl font-semibold">S/.{product.precio}</p>
                </div>
                <div className="h-full flex flex-col justify-center items-center lg:gap-2 gap-0">
                    <p>Stock Disponible:</p>
                    <p className="text-2xl font-bold">{product.stock}</p>
                </div>
                <div className="h-full flex flex-col justify-center items-center gap-2 px-2">
                    <p>Cantidad: </p>
                    <CarCantControl carrito_id={product.id} product_name={product.nombre} maxCant={product.stock} defaultCant={product.cantidad} fetchAgain={fetchAgain} fetchAtChange={true} />
                </div>
                <div className="h-full flex flex-col justify-center items-center gap-2 px-2">
                    <p>Total: </p>
                    <p className="text-2xl font-bold">S/.{product.precio * product.cantidad}</p>
                </div>
                <div className="absolute top-1 right-2 flex gap-3 items-center">
                    <Link to={`/product/${product.nombre}-${product.producto_id}`} className="duration-300 text-md hover:text-blue-500 cursor-pointer">
                        <FontAwesomeIcon icon={faExternalLink}/>
                    </Link>
                    <InactiveProductCart carrito_id={product.id} fetchAgain={fetchAgain}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </InactiveProductCart>
                </div>
            </div>
        </>
    )
}

ProductCart.propTypes = {
    product: PropTypes.object,
    fetchAgain: PropTypes.func,
}