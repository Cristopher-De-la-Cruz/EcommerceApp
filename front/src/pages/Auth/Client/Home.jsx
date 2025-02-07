import { Layout } from '../../../components/auth/client/Layout';
import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../context/Auth/AuthContext';
import { FilterContext } from '../../../context/Filter/FilterContext';
import apiRoutes from '../../../services/apiRoutes';
import { useApi } from '../../../hooks/useApi';
import { ProductCard } from '../../../components/ProductCard';
import { PageControl } from '../../../components/PageControl';
import { ToastContext } from '../../../context/Toast/ToastContext';

export const Home = () => {
    const { token } = useContext(AuthContext);
    const { toast, theme } = useContext(ToastContext);
    const { categoria, limite, setLimite } = useContext(FilterContext);
    const { fetchApi, isLoading } = useApi();
    const [searchParams, setSearchParams] = useSearchParams();
    // const page = Number(searchParams.get('page')) || 1; // Obtener el query string page
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);


    const [productos, setProductos] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [precioFilter, setPrecioFilter] = useState({ desde: '', hasta: '' });
    const [filterPrice, setFilterPrice] = useState(false);
    const [apiURL, setApiURL] = useState(`${apiRoutes.productos.get}?estado=1&page=${page}&limit=${limite}&precioDesde=${precioFilter.desde}&precioHasta=${precioFilter.hasta}&categoria=${categoria.id}`);

    const getProductos = async () => {
        const response = await fetchApi(apiURL, 'GET', null, token);
        if (response.success) {
            setProductos(response.body.productos);
            setMaxCount(response.body.maxCount);
        } else {
            toast.error(response.body.message || 'Error al obtener los productos', { position: 'bottom-right', theme });
        }
    };

    useEffect(() => {
        setSearchParams({ page: page })
        setApiURL(
            `${apiRoutes.productos.get}?estado=1&page=${page}&limit=${limite}&precioDesde=${precioFilter.desde}&precioHasta=${precioFilter.hasta}&categoria=${categoria.id}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limite, filterPrice, categoria]);

    useEffect(() => {
        getProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL]);

    return (
        <Layout title="Home" publico={true}>
            <div className="w-full flex justify-center py-2">
                <div className="md:w-5/6 w-full flex lg:flex-row flex-col lg:justify-between lg:items-start items-center lg:gap-0 gap-5">
                    {/* Filtros */}
                    <div className="lg:w-[20%] w-[90%] flex flex-col gap-2">
                        <div className="w-full border-b-2">
                            <h2 className="text-xl font-bold text-center">Filtrar por precio</h2>
                        </div>
                        <div className="border-2 w-full rounded-md flex flex-col gap-2 p-2">
                            <div className="flex justify-around">
                                <input
                                    className="w-1/3 border rounded-md text-center"
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
                                    className="w-1/3 border rounded-md text-center"
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
                            <div>
                                <button
                                    onClick={() => setFilterPrice((filterPrice) => !filterPrice)}
                                    className="bg-blue-800 hover:bg-blue-950 cursor-pointer text-white w-full rounded-md border-[1.5px] border-black dark:border-white"
                                >
                                    Filtrar
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Productos */}
                    <div className="lg:w-[75%] w-[90%] flex flex-col gap-2">
                        <div className="w-full border-b-2">
                            <h2 className="text-xl font-bold text-center">Productos ({categoria.nombre})</h2>
                        </div>
                        {productos.length < 1 && isLoading && <p>Cargando productos...</p>}
                        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-2 py-3">
                            {productos.length > 0 && (
                                productos.map((producto) => <ProductCard key={producto.id} producto={producto} watchOnly={false} fetchAgain={getProductos} />)
                            )
                            }
                            {
                                isLoading == false && productos.length < 1 && <p>No hay productos para mostrar</p>
                            }
                        </div>
                        {/* Paginación */}
                        <div className="w-full duration-400 flex xl:flex-row xl:justify-between flex-col justify-start items-start xl:gap-0 gap-2">
                            <div className="xl:w-1/3 w-full flex xl:justify-start justify-center gap-2">
                                <p className="">Viendo</p>
                                <select
                                    className="bg-transparent border"
                                    defaultValue={limite}
                                    onChange={(e) => {
                                        setLimite(e.target.value);
                                    }}
                                >
                                    {[12, 18, 24, 30, 36].map((limit) => (
                                        <option
                                            key={limit}
                                            className="bg-slate-100 dark:bg-zinc-900"
                                        >
                                            {limit}
                                        </option>
                                    ))}
                                </select>
                                <p className="">por página</p>
                            </div>
                            <div className="xl:w-2/3 w-full flex xl:justify-end justify-center">
                                {/* <PageControl pagina={page} maxCount={maxCount} limite={limite} path={window.Location.pathname} /> */}
                                <PageControl pagina={page} setPagina={setPage} maxCount={maxCount} limite={limite} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};
