import { useParams } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { AuthContext } from "../../../context/Auth/AuthContext";
import { useApi } from "../../../hooks/useApi";
import apiRoutes from "../../../services/apiRoutes";
import { Layout } from "../../../components/auth/client/Layout";
import { ProductShowBody } from "../../../components/ProductShowBody";
import { ToastContext } from "../../../context/Toast/ToastContext";


export const ProductShow = () => {
    const { nombreId } = useParams();
    const [nombre, id] = nombreId.split('-');
    const { fetchApi, isLoading } = useApi();
    const { token } = useContext(AuthContext);
    const { toast, theme } = useContext(ToastContext);
    const apiShow = `${apiRoutes.productos.show}/${id}/${nombre}`;

    const [producto, setProducto] = useState(false);

    const getProducto = async () => {
        const response = await fetchApi(apiShow, 'GET', null, token);
        if (response.success) {
            setProducto(response.body.producto);
        } else {
            toast.error(response.body.message || 'Error al obtener el producto', { position: 'bottom-right', theme: theme });
        }
    };

    useEffect(() => {
        getProducto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiShow]);


    return (
        <Layout title={nombre} publico={true}>
            {
                isLoading && producto == false && <p>Cargando producto...</p>
            }
            {
                producto != false && producto != null && <ProductShowBody producto={producto} fetchAgain={getProducto} />
            }
            {
                isLoading == false && producto == null && <p>Producto no encontrado</p>
            }
        </Layout>
    )
}
