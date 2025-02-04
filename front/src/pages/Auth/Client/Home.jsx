import { Layout } from '../../../components/auth/client/Layout'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/Auth/AuthContext'
import { ThemeContext } from '../../../context/Theme/ThemeContext'
import apiRoutes from '../../../services/apiRoutes'
import { useApi } from '../../../hooks/useApi'
import { toast, ToastContainer } from 'react-toastify'
import { ProductCard } from '../../../components/ProductCard'
import { PageControl } from '../../../components/PageControl'

export const Home = () => {
    const { token } = useContext(AuthContext)
    const [productos, setProductos] = useState([]);
    const { fetchApi, isLoading } = useApi();
    const { theme } = useContext(ThemeContext)
    const [apiURL, setApiURL] = useState(`${apiRoutes.productos.get}?estado=1`);
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(12);
    const [maxCount, SetMaxCount] = useState(0);
    const [precioFilter, setPrecioFilter] = useState({ desde: '', hasta: '' });
    const [filterPrice, setFilterPrice] = useState(false);

    const getProductos = async () => {
        const response = await fetchApi(apiURL, 'GET', null, token)
        console.log(response.body);
        if (response.success) {
            setProductos(response.body.productos);
            SetMaxCount(response.body.maxCount);
        } else {
            toast.error(response.body.message || 'Error al obtener los productos', { position: "bottom-right", theme: theme });
        }
    }

    useEffect(() => {
        getProductos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL])

    useEffect(() => {
        console.log('changed')
        setApiURL(`${apiRoutes.productos.get}?estado=1&pagina=${pagina}&limite=${limite}&precioDesde=${precioFilter.desde}&precioHasta=${precioFilter.hasta}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagina, limite, filterPrice]);



    return (
        <Layout title="Home">
            <div className='w-full flex justify-center py-2'>
                <div className='md:w-5/6 w-full flex lg:flex-row flex-col lg:justify-between lg:items-start items-center lg:gap-0 gap-5'>
                    {/* Filtros */}
                    <div className='lg:w-[20%] w-[90%] flex flex-col gap-2'>
                        <div className='w-full border-b-2'>
                            <h2 className='text-xl font-bold text-center'>Filtrar por precio</h2>
                        </div>
                        <div className='border-2 w-full rounded-md flex flex-col gap-2 p-2'>
                            <div className='flex justify-around'>
                                <input className='w-1/3 border rounded-md text-center'
                                    value={precioFilter.desde}
                                    onChange={(e) => setPrecioFilter({ ...precioFilter, desde: e.target.value })}
                                    type="number" placeholder='Desde' min={0}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e') e.preventDefault();
                                    }} />
                                <p>-</p>
                                <input className='w-1/3 border rounded-md text-center'
                                    value={precioFilter.hasta}
                                    onChange={(e) => setPrecioFilter({ ...precioFilter, hasta: e.target.value })}
                                    type="number" placeholder='Hasta' min={0}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e') e.preventDefault();
                                    }} />
                            </div>
                            <div>
                                <button onClick={() => setFilterPrice(filterPrice => !filterPrice)} className='bg-blue-800 hover:bg-blue-950 cursor-pointer text-white w-full rounded-md border-[1.5px] border-black dark:border-white'>Filtrar</button>
                            </div>
                        </div>
                    </div>
                    {/* Productos */}
                    <div className='lg:w-[75%] w-[90%] flex flex-col gap-2'>
                        <div className='w-full border-b-2'>
                            <h2 className='text-xl font-bold text-center'>Productos</h2>
                        </div>
                        {
                            productos.length < 1 && isLoading && <p>Cargando productos...</p>
                        }
                        <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-2 py-3'>
                            {
                                productos.map(producto => (
                                    <ProductCard key={producto.id} producto={producto} watchOnly={false} />
                                ))
                            }
                        </div>
                        {/* Paginación */}
                        <div className='w-full duration-400 flex xl:flex-row xl:justify-between flex-col justify-start items-start xl:gap-0 gap-2'>
                            <div className='xl:w-1/3 w-full flex xl:justify-start justify-center gap-2'>
                                <p className=''>Viendo</p>
                                <select className='bg-transparent border' onChange={(e) => { setLimite(e.target.value) }}>
                                    {
                                        [12, 18, 24, 30, 36].map(limit => (
                                            <option key={limit} className='bg-slate-100 dark:bg-zinc-900'
                                                selected={limit === limite}
                                            >
                                                {limit}
                                            </option>
                                        ))
                                    }
                                </select>
                                <p className=''>por página</p>
                            </div>
                            <div className='xl:w-2/3 w-full flex xl:justify-end justify-center'>
                                <PageControl pagina={pagina} maxCount={maxCount} limite={limite} setPagina={setPagina} />
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </Layout>
    )
}
