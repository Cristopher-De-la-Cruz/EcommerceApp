import { Layout } from "../../../components/auth/client/Layout"
import { useApi } from "../../../hooks/useApi"
import { useContext, useEffect, useState } from "react"
import { ToastContext } from "../../../context/Toast/ToastContext"
import { AuthContext } from "../../../context/Auth/AuthContext"
import apiRoutes from "../../../services/apiRoutes"
import { useSearchParams } from "react-router-dom"
import { OrderCard } from "../../../components/ventas/OrderCard"
import { PageControl } from "../../../components/PageControl"

export const MyOrders = () => {
    const { fetchApi } = useApi();
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const [orders, setOrders] = useState([])
    const [maxCount, setMaxCount] = useState(0)

    const [searchParams, setSearchParams] = useSearchParams();
    const [desde, setDesde] = useState(searchParams.get('desde') || '');
    const [hasta, setHasta] = useState(searchParams.get('hasta') || '');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 12);

    const [apiURL, setApiURL] = useState(`${apiRoutes.ventas.get}?desde=${desde}&hasta=${hasta}&page=${page}&limit=${limit}`);


    const getOrders = async () => {
        const response = await fetchApi(apiURL, 'GET', null, token);
        console.log(response)
        if (response.success) {
            setOrders(response.body.ventas)
            setMaxCount(response.body.maxCount)
        } else {
            toast.error(response.body.message, { position: 'bottom-right', theme: theme })
        }
    }

    // const addPage = () => {
    //     setPage(page + 1)
    // }



    useEffect(() => {
        setSearchParams({ page: page, desde: desde, hasta: hasta, limit: limit })
        setApiURL(`${apiRoutes.ventas.get}?desde=${desde}&hasta=${hasta}&page=${page}&limit=${limit}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desde, hasta, page, limit]);

    useEffect(() => {
        getOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL]);

    return (
        <Layout title={'Mis Pedidos'}>
            <div className="w-full h-full flex justify-center gap-3">
                <div className="md:w-5/6 w-full h-full p-3 flex md:flex-row flex-col gap-3">
                    <div className="md:w-1/4 w-full">
                        <div className="md:sticky md:top-18 block w-full p-3">
                            <div className="w-full h-full flex flex-col gap-3">
                                <div className="border-b-2">
                                    <h2 className="text-2xl font-semibold text-center">Filtros</h2>
                                </div>
                                <div>
                                    <div>
                                        <p className="text-lg font-medium">Desde:</p>
                                    </div>
                                    <div>
                                        <input className="text-black dark:bg-gray-500 border-2 py-1 px-2 rounded-md w-full"
                                            name="desde"
                                            value={desde}
                                            onChange={(e) => {
                                                setDesde(e.target.value);
                                                setPage(1);
                                            }}
                                            type="date" />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className="text-lg font-medium">Hasta:</p>
                                    </div>
                                    <div>
                                        <input className="text-black dark:bg-gray-500 border-2 py-1 px-2 rounded-md w-full"
                                            name="hasta"
                                            value={hasta}
                                            onChange={(e) => {
                                                setHasta(e.target.value)
                                                setPage(1);
                                            }}
                                            type="date" />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className="text-lg font-medium">Limite:</p>
                                    </div>
                                    <div>
                                        <select className="border-2 py-1 px-2 rounded-md w-full"
                                            value={limit}
                                            onChange={(e) => {
                                                setLimit(e.target.value);
                                            }}>
                                            {[12, 18, 24, 30, 36].map((limit) => (
                                                <option
                                                    key={limit}
                                                    className="bg-slate-100 text-black dark:bg-zinc-900 dark:text-white"
                                                >
                                                    {limit}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-3/4 w-full">
                        <div className="w-full p-3">
                            <div className="border-b-2">
                                <h2 className="text-2xl font-bold text-center">Mis Pedidos</h2>
                            </div>
                            <div className="w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5 py-3">
                                {
                                    orders.map((order) => (
                                        <OrderCard key={order.id} order={order} />

                                    ))
                                }
                            </div>
                            {
                                orders.length > 0 && <PageControl pagina={page} setPagina={setPage} maxCount={maxCount} limite={limit} />
                            }
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
