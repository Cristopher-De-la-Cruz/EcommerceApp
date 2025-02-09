import { AdminLayout } from "../../../components/auth/admin/AdminLayout"
import { ProductsBarChart } from "../../../components/auth/admin/dashboard/ProductsBarChart";
import { Progress } from "../../../components/auth/admin/dashboard/Progress";
import { CategoriesPieChart } from "../../../components/auth/admin/dashboard/CategoriesPieChart";
import apiRoutes from "../../../services/apiRoutes";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/Auth/AuthContext";
import { useApi } from "../../../hooks/useApi"
import { ToastContext } from "../../../context/Toast/ToastContext";


export const AdminHome = () => {
    const [dashboardData, setDashboardData] = useState({});
    const { token } = useContext(AuthContext);
    const { toast, theme } = useContext(ToastContext);
    const { fetchApi } = useApi();

    const getDashboardData = async () => {
        try {
            const response = await fetchApi(apiRoutes.ventas.dashboard, 'GET', null, token);
            if (response.status === 200) {
                setDashboardData(response.body);
            } else {
                toast.error(response.body.message, { position: 'bottom-right', theme: theme });
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al obtener los datos de ventas', { position: 'bottom-right', theme: theme });
        }
    }

    useEffect(() => {
        getDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <AdminLayout title="Home - Admin">
            <div className="w-full flex flex-col gap-5">
                <div className="w-full flex md:flex-row flex-col items-center justify-around gap-5 py-3">
                    <div className="flex justify-center items-center">
                        <div className="w-full flex justify-center items-end gap-2">
                            <p className="text-xl font-semibold">Ventas Realizadas:</p>
                            <p className="text-2xl font-bold">{dashboardData.total_ventas}</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="w-full flex justify-center items-end gap-2">
                            <p className="text-xl font-semibold">Unidades Vendidas:</p>
                            <p className="text-2xl font-bold">{dashboardData.total_unidades}</p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="w-full flex justify-center items-end gap-2">
                            <p className="text-xl font-semibold">Ingresos:</p>
                            <p className="text-2xl font-bold">S/{dashboardData.total_ingreso}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex lg:flex-row flex-col gap-2 p-2">
                    <div className="lg:w-1/4 w-full h-full flex lg:flex-col md:flex-row flex-col gap-2">
                        <div className="duration-400 w-full h-64 shadow-lg dark:shadow-black rounded-xl flex flex-col justify-center items-center gap-2 py-2 relative border-t border-zinc-200 dark:border-zinc-800">
                            <div className="w-full h-7 flex justify-center items-center absolute top-1 left-0 px-2 opacity-80">
                                <h3 title="Meta de Ingresos" className="text-2xl font-bold text-center truncate">Meta de Ingresos Anuales</h3>
                            </div>
                            <div className="w-full h-full flex justify-center items-center text-black">
                                <Progress currentIncome={dashboardData.total_ingreso} targetIncome={500000} />
                            </div>
                        </div>
                        <div className="duration-400 w-full h-64 shadow-lg dark:shadow-black rounded-xl flex flex-col justify-center items-center gap-2 py-2 relative border-t border-zinc-200 dark:border-zinc-800">
                            <div className="w-full h-7 flex justify-center items-center absolute top-1 left-0 px-2 opacity-80">
                                <h3 title="Categorías con más ventas" className="text-2xl font-bold text-center truncate">Categorías con más ventas</h3>
                            </div>
                            <div className="w-full h-full flex justify-center items-center">
                                <CategoriesPieChart data={dashboardData?.top_categories} />
                            </div>
                        </div>
                    </div>
                    <div className="duration-400 lg:w-3/4 w-full h-130 shadow-lg dark:shadow-black rounded-xl flex flex-col gap-2 py-2 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="w-full h-5 flex justify-center items-center opacity-80">
                            <h3 title="Productos con más ingresos" className="text-2xl font-bold text-center truncate">Productos con más ingresos</h3>
                        </div>
                        <div className="w-full h-120 flex justify-center items-center text-black">
                            <ProductsBarChart data={dashboardData?.top_products} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
