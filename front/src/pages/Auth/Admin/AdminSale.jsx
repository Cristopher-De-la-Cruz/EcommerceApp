import { AdminLayout } from "../../../components/auth/admin/AdminLayout"
import { useParams } from "react-router-dom"
import { useApi } from "../../../hooks/useApi"
import { useContext, useEffect, useState } from "react"
import { ToastContext } from "../../../context/Toast/ToastContext"
import { AuthContext } from "../../../context/Auth/AuthContext"
import apiRoutes from "../../../services/apiRoutes";
import CryptoJS from "crypto-js"
import { Carrousel } from "../../../components/Carrousel";

export const AdminSale = () => {
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const { fetchApi, isLoading } = useApi();

    const [notFound, setNotFound] = useState(false);
    const [order, setOrder] = useState(null);

    const decryptId = (encryptedId) => {
        const secretKey = 'mi_clave_secreta';
        const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8); // Recupera el ID original
    };
    //Obtener el id de la orden
    const { id } = useParams();

    const originalId = decryptId(decodeURIComponent(id)) || 0;
    const apiRoute = `${apiRoutes.ventas.show}${originalId}`;

    const getOrder = async () => {
        try {
            const response = await fetchApi(apiRoute, 'GET', null, token);
            if (response.success) {
                setOrder(response.body);
            } else {
                if (response.status == 404) {
                    setNotFound(true);
                } else if (response.status == 400) {
                    response.body.forEach(error => {
                        toast.error(error.message, { position: 'bottom-right', theme: theme });
                    });
                } else {
                    toast.error(response.body.message, { position: 'bottom-right', theme: theme });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al obtener el pedido', { position: 'bottom-right', theme: theme });
        }
    }

    useEffect(() => {
        getOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AdminLayout title="Venta - Admin">
            <div className="w-full h-full flex justify-center">
                <div className="w-5/6 flex flex-col items-start py-2">
                    <div className="w-full border-b-2 flex justify-start py-1">
                        <h1 className="text-center text-3xl font-bold">Pedido</h1>
                    </div>
                    {
                        isLoading && <p>Cargando pedido...</p>
                    }
                    {
                        !isLoading && notFound && <p>Pedido no encontrado</p>
                    }
                    {
                        !isLoading && !notFound && order != null &&
                        <div className="w-full flex flex-col py-2 gap-5">
                            {/* Cabecera */}
                            <div className="flex flex-col gap-2 py-2">
                                <div className="border-b flex justify-between">
                                    <div className="flex md:flex-row flex-col md:gap-3 gap-0">
                                        <p className="md:text-xl text-sm font-thin">12/02/2022</p>
                                        <p className="md:block hidden">-</p>
                                        <p className="md:text-lg text-md font-medium truncate">Mz. La Roca</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="md:text-xl text-md font-thin italic">{order.cliente}</p>
                                    </div>
                                </div>
                                <div className="flex md:flex-row md:justify-around flex-col md:gap-3 gap-0 md:text-xl text-md font-semibold">
                                    <p>Cant. Productos: {order.detalle.length}</p>
                                    <p>Unidades: {order.unidades}</p>
                                    <p>Total: S/.{order.total}</p>
                                </div>
                            </div>

                            <div>
                                <div className="border-b-2">
                                    <h2 className="text-2xl font-semibold">Productos adquiridos:</h2>
                                </div>
                                <div className="w-full grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5 py-3">
                                    {
                                        order.detalle.map((item) => (
                                            <div className="shadow-xl shadow-slate-300 dark:shadow-black rounded-xl w-full flex flex-col" key={item.id}>
                                                <div className="w-full truncate flex justify-center gap-3">
                                                    {
                                                        console.log(item.imagenes)
                                                    }
                                                    {/* {
                                                                item.imagenes.map((img, index) => (
                                                                    <img className='h-40 object-cover rounded-md' key={index} src={img.imagen} alt={item.nombre} />
                                                                ))
                                                            } */}
                                                    <Carrousel slides={item.imagenes.map(image => { return { ...image, image: image.imagen } })} height='h-60' />
                                                </div>
                                                <div className="w-full py-2">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-center">{item.nombre}</h3>
                                                    </div>
                                                    <div className="w-full flex flex-col items-center gap-1 py-3 px-2">
                                                        <div className="w-[90%]">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-lg font-medium">Precio Unitario: </p>
                                                                <p className="text-lg font-semibold">S/.{item.precio}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-lg font-medium">Cantidad: </p>
                                                                <p className="text-lg font-semibold">S/.{item.cantidad}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-lg font-medium">Sub Total: </p>
                                                                <p className="text-lg font-semibold">S/.{item.sub_total}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </div>
        </AdminLayout>
    )
}
