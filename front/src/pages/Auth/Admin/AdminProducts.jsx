import { AdminLayout } from "../../../components/auth/admin/AdminLayout"
import { AuthContext } from "../../../context/Auth/AuthContext";
import { useContext } from "react"
import { ToastContext } from "../../../context/Toast/ToastContext"
import { useApi } from "../../../hooks/useApi"
import { useEffect, useState } from "react"
import { PageControl } from "../../../components/PageControl"
import { LimitControl } from "../../../components/LimitControl"
import apiRoutes from "../../../services/apiRoutes";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { ProductCard } from "../../../components/auth/admin/products/ProductCard";
import { AddProductButton } from "../../../components/auth/admin/products/AddProductButton";
import { CategoryFilter } from "../../../components/auth/admin/products/CategoryFilter";

export const AdminProducts = () => {
    const [firstRender, setFirstRender] = useState(true);

    const { fetchApi } = useApi();
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const [productos, setProductos] = useState([]);
    const [estado, setEstado] = useState(Cookies.get('estadoProductos') || 1);
    const [precioFilter, setPrecioFilter] = useState({desde: '', hasta: ''})
    const [stockFilter, setStockFilter] = useState({desde: '', hasta: ''})
    const [category, setCategory] = useState('')

    const [categories, setCategories] = useState([]);
    const [maxCount, setMaxCount] = useState(0);

    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(Cookies.get('limite')) || 12);

    const [apiURL, setApiURL] = useState(`${apiRoutes.productos.get}?page=${page}&limit=${limit}&estado=${estado}&precioDesde=${precioFilter.desde}&precioHasta=${precioFilter.hasta}&stockDesde=${stockFilter.desde}&stockHasta=${stockFilter.hasta}&categoria=${category}`);

    const getProductos = async () => {
        try {
            const response = await fetchApi(apiURL, 'GET', null, token);
            if (response.success) {
                setProductos(response.body.productos);
                setMaxCount(response.body.maxCount);
            } else {
                toast.error(response.body.message, { position: 'bottom-right', theme: theme });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al obtener las categorías', { position: 'bottom-right', theme: theme });
        }
    }

    const getCategories = async () => {
        try {
            const response = await fetchApi(apiRoutes.categorias.get, 'GET');
            if (response.success) {
                setCategories(response.body.categorias);
            } else {
                toast.error(response.body.message, { position: 'bottom-right', theme: theme });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al obtener las categorías', { position: 'bottom-right', theme: theme });
        }
    }

    const changeEstado = () => {
        setEstado((estado) => estado == 1 ? 0 : 1);
        Cookies.set('estadoProductos', estado == 1 ? 0 : 1);
    }

    useEffect(() => {
        if (firstRender) {
            setFirstRender(false);
            return;
        }
        if ((searchParams.get('page') || 1) != page) {
            setSearchParams({ page: page })
        }
        setApiURL(`${apiRoutes.productos.get}?page=${page}&limit=${limit}&estado=${estado}&precioDesde=${precioFilter.desde}&precioHasta=${precioFilter.hasta}&stockDesde=${stockFilter.desde}&stockHasta=${stockFilter.hasta}&categoria=${category}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, estado, precioFilter, stockFilter, category])

    useEffect(() => {
        getProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL]);

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AdminLayout title="Productos - Admin">
            <div className="w-full h-full flex flex-col gap-3 pb-3 px-3">
                <div className="w-full sticky top-16 py-3 border-b-2 py-2 flex justify-between items-center bg-slate-100 dark:bg-zinc-900">
                    <div className="flex justify-start items-end gap-2">
                        <h1 className="text-2xl font-bold">Productos</h1>
                        <p className="text-lg font-semibold">({maxCount})</p>
                    </div>
                    <AddProductButton fetchAgain={getProductos} categories={categories} />
                </div>
                <div className="w-full flex sm:flex-row flex-col py-2">
                    <div className="lg:w-1/4 md:w-1/3 w-full pr-3 pb-3">
                        <div className="w-full sm:sticky block sm:top-32">
                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full text-center border-b-2 border-zinc-500 py-1">
                                    <h2 className="text-xl font-semibold">Filtros</h2>
                                </div>
                                <div className="w-full flex gap-2 items-center px-2">
                                    <h3 className="text-lg font-medium w-16 min-w-16">Estado: </h3>
                                    <button onClick={changeEstado}
                                        className={`duration-400 border-2 rounded-xl px-2 ${estado == 1 ? 'border-green-600 hover:text-green-600 dark:border-lime-400 dark:hover:text-lime-400' : 'border-red-500 hover:text-red-500'} 
                                        cursor-pointer font-semibold`}>{estado == 1 ? 'Activos' : 'Inactivos'}</button>
                                </div>
                                <div className="w-full flex gap-2 items-center px-2">
                                    <h3 className="text-lg font-medium w-16 min-w-16">Precio: </h3>
                                    <div className="flex justify-start gap-2">
                                        <input
                                            className="w-1/3 border-2 rounded-md text-center"
                                            value={precioFilter.desde}
                                            onChange={(e) => setPrecioFilter({ ...precioFilter, desde: e.target.value })}
                                            type="number"
                                            placeholder="Desde"
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e') e.preventDefault();
                                            }}
                                        />
                                        <p>-</p>
                                        <input
                                            className="w-1/3 border-2 rounded-md text-center"
                                            value={precioFilter.hasta}
                                            onChange={(e) => setPrecioFilter({ ...precioFilter, hasta: e.target.value })}
                                            type="number"
                                            placeholder="Hasta"
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e') e.preventDefault();
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex gap-2 items-center px-2">
                                    <h3 className="text-lg font-medium w-16 min-w-16">Stock: </h3>
                                    <div className="flex justify-start gap-2">
                                        <input
                                            className="w-1/3 border-2 rounded-md text-center"
                                            value={stockFilter.desde}
                                            onChange={(e) => setStockFilter({ ...stockFilter, desde: e.target.value })}
                                            type="number"
                                            placeholder="Desde"
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e') e.preventDefault();
                                            }}
                                        />
                                        <p>-</p>
                                        <input
                                            className="w-1/3 border-2 rounded-md text-center"
                                            value={stockFilter.hasta}
                                            onChange={(e) => setStockFilter({ ...stockFilter, hasta: e.target.value })}
                                            type="number"
                                            placeholder="Hasta"
                                            min={0}
                                            onKeyDown={(e) => {
                                                if (e.key === '-' || e.key === 'e') e.preventDefault();
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-2">
                                    <CategoryFilter categories={categories} category={category} setCategory={setCategory}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-3/4 md:w-2/3 w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-5">
                        {
                            productos.map((product) => (
                                <ProductCard key={product.id} producto={product} fetchAgain={getProductos} categories={categories} />
                            ))
                        }
                    </div>
                </div>
                <div className="w-full flex sm:flex-row flex-col justify-between">
                    <LimitControl limit={limit} setLimit={setLimit} />
                    <PageControl pagina={page} setPagina={setPage} maxCount={maxCount} limite={limit} />
                </div>
            </div>
        </AdminLayout>
    )
}
