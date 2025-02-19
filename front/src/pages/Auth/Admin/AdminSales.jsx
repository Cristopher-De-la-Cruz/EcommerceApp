import { AdminLayout } from "../../../components/auth/admin/AdminLayout"
import { AuthContext } from "../../../context/Auth/AuthContext";
import { useContext } from "react"
import { ToastContext } from "../../../context/Toast/ToastContext"
import { useApi } from "../../../hooks/useApi"
import { useEffect, useState } from "react"
import apiRoutes from "../../../services/apiRoutes";
import { useSearchParams } from "react-router-dom";
import { OrderCard } from "../../../components/ventas/OrderCard";
import { PageControl } from "../../../components/PageControl";

export const AdminSales = () => {

    const { fetchApi } = useApi();
    const { toast, theme } = useContext(ToastContext);
    const { token, isLogged } = useContext(AuthContext);
    const [ventas, setVentas] = useState([]);
    const [maxCount, setMaxCount] = useState(0);

    const [isFirstRender, setIsFirstRender] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [desde, setDesde] = useState(() => {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - 1);
        return searchParams.get('desde') || fecha.toISOString().split('T')[0];
    });

    const [hasta, setHasta] = useState(() => {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() + 1);
        return searchParams.get('hasta') || fecha.toISOString().split('T')[0];
    });
    
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 12);

    const [apiURL, setApiURL] = useState(`${apiRoutes.ventas.get}?desde=${desde}&hasta=${hasta}&page=${page}&limit=${limit}`);


    const getVentas = async () => {
        try {
            const response = await fetchApi(apiURL, 'GET', null, token);
            if (response.success) {
                setVentas(response.body.ventas);
                setMaxCount(response.body.maxCount);
            } else {
                toast.error(response.body.message, { position: 'bottom-right', theme: theme });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al obtener las categorías', { position: 'bottom-right', theme: theme });
        }
    }

    useEffect(() => {
        getVentas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL])

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        if (isLogged) {
            setSearchParams({ page: page, desde: desde, hasta: hasta, limit: limit })
            setApiURL(`${apiRoutes.ventas.get}?desde=${desde}&hasta=${hasta}&page=${page}&limit=${limit}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desde, hasta, page, limit, isLogged]);

    return (
        <AdminLayout title="Ventas - Admin">
            <div className="w-full h-full flex flex-col gap-3 pb-3 px-3">
                <div className="w-full sticky top-16 py-3 border-b-2 py-2 flex justify-between items-center bg-slate-100 dark:bg-zinc-900">
                    <div className="flex justify-start items-end gap-2">
                        <h1 className="text-2xl font-bold">Ventas</h1>
                        <p className="text-lg font-semibold">({maxCount})</p>
                    </div>
                </div>
                <div className="w-full flex sm:flex-row flex-col py-2">
                    <div className="lg:w-1/4 md:w-1/3 w-full pr-3 pb-3">
                        <div className="w-full sm:sticky block sm:top-32">
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
                    <div className="lg:w-3/4 md:w-2/3 w-full grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-5">
                        {
                            ventas.map((venta) => (
                                <OrderCard key={venta.id} order={venta} admin />

                            ))
                        }
                    </div>
                </div>
                <div className="w-full flex justify-end">
                    <PageControl pagina={page} setPagina={setPage} maxCount={maxCount} limite={limit} />
                </div>
            </div>
        </AdminLayout>
    )
}
