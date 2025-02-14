import { useContext, useEffect, useState } from "react";
import { Layout } from "../../../components/auth/client/Layout"
import { useApi } from "../../../hooks/useApi";
import { ToastContext } from "../../../context/Toast/ToastContext";
import { AuthContext } from "../../../context/Auth/AuthContext";
import apiRoutes from "../../../services/apiRoutes";
import { Link } from "react-router-dom";
import { VentaForm } from "../../../components/ventas/VentaForm";

export const Compra = () => {
    const { fetchApi } = useApi();
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
        <Layout title={'Finalizar la compra'}>
            <div className="h-full w-full flex md:flex-row flex-col">
                <div className="md:w-4/6 w-full h-full flex justify-center items-center py-10">
                    <VentaForm />
                </div>
                <div style={{ height: 'calc(100vh - 4rem)' }} className="md:w-2/6 w-full sticky top-16 bg-white dark:bg-black p-3 flex flex-col gap-5">
                    <div className="border-b-2 py-2 text-center">
                        <h2 className="text-2xl font-semibold">Resumen de la compra</h2>
                    </div>
                    <div className="max-h-70 overflow-auto">
                        <div className="flex w-full h-full justify-center">
                            <div className="w-[95%]">
                                {
                                    products.map((product, index) => {

                                        let subtotal = Math.round((product.precio * product.cantidad) * 100);
                                        subtotal = subtotal.toString();

                                        if (subtotal.length <= 2) {
                                            subtotal = '0.' + '00'.slice(subtotal.length) + subtotal;
                                        } else {
                                            // Insertar el punto decimal antes de los dos últimos dígitos
                                            subtotal = subtotal.slice(0, subtotal.length - 2) + '.' + subtotal.slice(subtotal.length - 2);
                                        }

                                        return (
                                            <div key={index} className="flex flex-start gap-2 truncate h-20 my-3">
                                                <div className="h-full w-20 min-w-20">
                                                    <Link to={`/product/${product.nombre}-${product.producto_id}`} className="h-full w-full flex justify-center items-center">
                                                        <img src={product.imagen} alt={product.nombre} className="h-full rounded-md object-cover " />
                                                    </Link>
                                                </div>
                                                <div className="h-full">
                                                    <p title={product.nombre} className="text-lg w-full truncate font-semibold">({product.cantidad}) {product.nombre} </p>
                                                    <p className="text-sm text-blue-500 font-semibold">S/.{product.precio}</p>
                                                    <p className="text-xl text-red-600 font-bold">S/.{subtotal}</p>
                                                </div>
                                            </div>

                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center gap-3 px-3 py-2">
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
                            <div className="flex justify-start">
                                <p className="text-lg font-bold">S/.{total}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
