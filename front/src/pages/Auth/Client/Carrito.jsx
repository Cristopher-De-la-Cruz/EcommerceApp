import { Layout } from '../../../components/auth/client/Layout';
import apiRoutes from '../../../services/apiRoutes';
import { useApi } from '../../../hooks/useApi';
import { useContext, useEffect, useState } from 'react';
import { ToastContext } from '../../../context/Toast/ToastContext';
import { AuthContext } from '../../../context/Auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { CartBody } from '../../../components/cart/CartBody';

export const Carrito = () => {
    const { fetchApi, isLoading } = useApi();
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const [products, setProducts] = useState([])
    const getCartProducts = async () => {
        const response = await fetchApi(apiRoutes.carrito.get, 'GET', null, token);
        if (response.success) {
            setProducts(response.body)
        } else {
            toast.error(response.body.message, { position: 'bottom-right', theme: theme })
        }
    }

    useEffect(() => {
        getCartProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const unidades = products.reduce((acum, product) => {
        return acum + product.cantidad
    }, 0)

    return (
        <Layout title={'Mi Carrito'}>
            <div className='w-[97%] h-full flex flex-col gap-3 p-4'>
                <div className='w-full border-b-2 border-red-500 py-2 flex justify-start items-end gap-3'>
                    <h1 className='text-4xl text-red-600 font-medium'><FontAwesomeIcon icon={faShoppingCart} /> Mi Carrito</h1>
                    <p className='sm:text-2xl text-md text-center'>({unidades} unidades)</p>
                </div>

                <CartBody products={products} fetchAgain={getCartProducts} isLoading={isLoading} unidades={unidades} />
            </div>
        </Layout>
    )
}
