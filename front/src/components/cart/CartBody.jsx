import { PropTypes } from 'prop-types'
import { ProductCart } from "./ProductCart"
import { Link } from 'react-router-dom'

export const CartBody = ({ products, fetchAgain, isLoading }) => {

    const unidades = products.reduce((acum, product) => {
        return acum + product.cantidad
    }, 0)

    const total = products.reduce((acum, product) => {
        acum = (acum * 100) + Math.round((product.precio * product.cantidad) * 100);

        acum = acum.toString();

        if (acum.length <= 2) {
            acum = '0.' + '00'.slice(acum.length) + acum;
        } else {
            acum = acum.slice(0, acum.length - 2) + '.' + acum.slice(acum.length - 2);
        }

        return parseFloat(acum);
    }, 0);


    return (
        <>
            {
                isLoading && products.length == 0 && <p>Cargando productos...</p>
            }
            {
                !isLoading && products.length == 0 && <p>No tienes productos en tu carrito</p>
            }
            <div className="w-full flex md:flex-row flex-col">
                <div className="lg:w-4/6 md:w-1/2 w-full p-3 flex flex-col gap-5">
                    {
                        products.map((product) => {
                            return (
                                <ProductCart key={product.id} product={product} fetchAgain={fetchAgain} />
                            )
                        })
                    }
                </div>
                <div className="lg:w-2/6 md:w-1/2 sticky top-20 w-full h-full p-3 relative">
                    <div className="w-full border-2 rounded-lg flex flex-col items-center gap-3 px-3 py-2">
                        <div className="w-full text-center">
                            <h2 className="text-2xl font-bold">Realizar Compra</h2>
                        </div>
                        <div className="w-4/6 flex justify-between">
                            <div className="flex justify-start">
                                <p className="text-md font-semibold">Cant. Productos:</p>
                            </div>
                            <div className="flex justify-start">
                                <p className="text-lg font-bold">{products.length}</p>
                            </div>
                        </div>
                        <div className="w-4/6 flex justify-between">
                            <div className="flex justify-start">
                                <p className="text-md font-semibold">Unidades:</p>
                            </div>
                            <div className="flex justify-start">
                                <p className="text-lg font-bold">{unidades}</p>
                            </div>
                        </div>
                        <div className="w-4/6 flex justify-between">
                            <div className="flex justify-start">
                                <p className="text-md font-semibold">Total:</p>
                            </div>
                            <div className="flex justify-start truncate">
                                <p className="text-lg font-bold">S/.{total}</p>
                            </div>
                        </div>
                        {
                            products.length > 0 &&
                            <div className="w-full flex justify-center items-center">
                                <Link to={'/buy'} className="duration-400 flex justify-center items-center h-14 w-3/4 rounded-full cursor-pointer text-xl font-semibold border-2 border-blue-800 hover:bg-blue-800 hover:text-white dark:hover:bg-cyan-400 dark:border-cyan-400">Comprar</Link>
                            </div>
                        }
                    </div>
                </div>

            </div>

        </>
    )
}

CartBody.propTypes = {
    products: PropTypes.array.isRequired,
    fetchAgain: PropTypes.func,
    isLoading: PropTypes.bool,
}
