import { useParams } from "react-router-dom"
import { AdminLayout } from "../../../components/auth/admin/AdminLayout";
import apiRoutes from "../../../services/apiRoutes";
import { useApi } from "../../../hooks/useApi";
import { useContext, useEffect, useState } from "react"
import { ToastContext } from "../../../context/Toast/ToastContext"
import { AuthContext } from "../../../context/Auth/AuthContext";
import { ProductImages } from "../../../components/auth/admin/products/ProductImages";
import { AddImagesButton } from "../../../components/auth/admin/products/AddImagesButton";

export const AdminProductImages = () => {
    const { NombreId } = useParams();
    const [nombre, id] = NombreId.split('-');

    const [producto, setProducto] = useState({});
    const [imagenesActivas, setImagenesActivas] = useState([]);
    const [imagenesInactivas, setImagenesInactivas] = useState([]);

    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const { fetchApi, isLoading } = useApi();

    const getProducto = async () => {
        try {
            const response = await fetchApi(`${apiRoutes.productos.showWithAllImages}${id}/${nombre}`, 'GET', null, token);
            if (response.success) {
                setProducto(response.body);
            } else {
                if (response.status !== 400) {
                    toast.error(response.body.message, { position: 'bottom-right', theme: theme })
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error, { position: 'bottom-right', theme: theme });
        }
    };

    useEffect(() => {
        getProducto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (producto.imagenes == undefined) {
            return;
        }
        setImagenesActivas(producto.imagenes.filter(imagen => imagen.estado == 1));
        setImagenesInactivas(producto.imagenes.filter(imagen => imagen.estado == 0));
    }, [producto]);

    return (
        <AdminLayout title={nombre}>
            {
                isLoading && producto.id == undefined && <p>Cargando producto...</p>
            }
            {
                !isLoading && producto.id == undefined && <p>Producto no encontrado</p>
            }
            {
                producto.id != undefined &&
                <div className="w-full z-20 h-full flex flex-col gap-3 pb-3 px-3">
                    <div className="w-full z-20 sticky top-16 py-3 border-b-2 py-2 flex justify-between items-center bg-slate-100 dark:bg-zinc-900">
                        <div className="flex justify-start items-end gap-2">
                            <h1 className="text-2xl font-bold">{producto.nombre}</h1>
                        </div>
                        <div>
                            <AddImagesButton fetchAgain={getProducto} producto = {producto} cantImgActivas = {imagenesActivas.length} />
                        </div>
                    </div>
                    <div className="w-full h-full grid sm:grid-cols-2 grid-cols-1 gap-4">
                        <div className="w-full h-full flex flex-col gap-2 rounded-xl p-2">
                            <h2 className="text-xl font-semibold border-b border-zinc-500 text-center">Imagenes activas</h2>
                            <ProductImages imagenes={imagenesActivas} fetchAgain={getProducto} />
                        </div>
                        <div className="w-full h-full flex flex-col gap-2 rounded-xl p-2">
                            <h2 className="text-xl font-semibold border-b border-zinc-500 text-center">Imagenes inactivas</h2>
                            <ProductImages imagenes={imagenesInactivas} fetchAgain={getProducto} />
                        </div>
                    </div>
                </div>
            }
            <p>{producto.length}</p>
        </AdminLayout>
    )
}
