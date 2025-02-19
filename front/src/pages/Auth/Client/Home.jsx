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
import { CategoryFilter } from '../../../components/auth/admin/products/CategoryFilter';
import { LimitControl } from '../../../components/LimitControl';

export const Home = () => {
    const { token } = useContext(AuthContext);
    const { toast, theme } = useContext(ToastContext);
    const { categoria, setCategoria, limite, setLimite } = useContext(FilterContext);
    const { fetchApi } = useApi();
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);


    const [isFirstRender, setIsFirstRender] = useState(true);
    const [categories, setCategories] = useState([]);



    const [productos, setProductos] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [precioFilter, setPrecioFilter] = useState({ desde: '', hasta: '' });
    const [stockFilter, setStockFilter] = useState({ desde: '', hasta: '' })

    const [apiURL, setApiURL] = useState(`${apiRoutes.productos.get}?estado=1&page=${page}&limit=${limite}&precioDesde=${precioFilter.desde}&precioHasta=${precioFilter.hasta}&categoria=${categoria.id}`);

    const getProductos = async () => {
        try {
            const response = await fetchApi(apiURL, 'GET', null, token);
            if (response.success) {
                setProductos(response.body.productos);
                setMaxCount(response.body.maxCount);
            } else {
                toast.error(response.body.message || 'Error al obtener los productos', { position: 'bottom-right', theme });
            }
        } catch(err){
            console.error(err)
            toast.error('Error al obtener los productos', {position: 'bottom-right', theme: theme});
        }
    };

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

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        setSearchParams({ page: page })
        setApiURL(
            `${apiRoutes.productos.get}?estado=1&page=${page}&limit=${limite}&precioDesde=${precioFilter.desde}&precioHasta=${precioFilter.hasta}&categoria=${categoria.id}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limite, categoria]);

    useEffect(() => {
        getProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL]);
    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Layout title="Home" publico={true}>
            <div className="w-full h-full flex flex-col gap-3 pb-3 px-3">
                <div className="w-full sticky top-16 py-3 border-b-2 py-2 flex justify-between items-center bg-slate-100 dark:bg-zinc-900">
                    <div className="flex justify-start items-end gap-2">
                        <h1 className="text-2xl font-bold">Productos</h1>
                        <p className="text-lg font-semibold">({maxCount})</p>
                    </div>
                </div>
                <div className="w-full flex sm:flex-row flex-col py-2">
                    <div className="lg:w-1/4 md:w-1/3 w-full pr-3 pb-3">
                        <div className="w-full h-full border-r border-zinc-500 sm:top-32">
                            <div className="w-full flex flex-col gap-2">
                                <div className="w-full text-center border-b border-zinc-500 py-1">
                                    <h2 className="text-xl font-semibold">Filtros</h2>
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
                                    <CategoryFilter categories={categories} category={categoria} setCategory={setCategoria} usingContext={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-3/4 md:w-2/3 w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-5">
                        {
                            productos.map((product) => (
                                <ProductCard key={product.id} producto={product} watchOnly={false} fetchAgain={getProductos} />
                            ))
                        }
                    </div>
                </div>
                <div className="w-full flex sm:flex-row flex-col justify-between">
                    <LimitControl limit={limite} setLimit={setLimite} />
                    <PageControl pagina={page} setPagina={setPage} maxCount={maxCount} limite={limite} />
                </div>
            </div>
        </Layout>
    );
};
