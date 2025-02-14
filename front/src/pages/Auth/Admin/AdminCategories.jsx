import { AdminLayout } from "../../../components/auth/admin/AdminLayout"
import apiRoutes from "../../../services/apiRoutes"
import { useApi } from "../../../hooks/useApi"
import { useEffect, useState, useContext } from "react"
import { ToastContext } from "../../../context/Toast/ToastContext"
import { CategoryCard } from "../../../components/auth/admin/categories/CategoryCard"
import { useSearchParams } from "react-router-dom"
import Cookies from "js-cookie"

import { PageControl } from "../../../components/PageControl"
import { LimitControl } from "../../../components/LimitControl"
import { AddCategoryButton } from "../../../components/auth/admin/categories/AddCategoryButton"

export const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(Cookies.get('limite')) || 12);
    const [estado, setEstado] = useState(Cookies.get('estadoCategorias') || 1);
    
    const [apiURL, setApiURL] = useState(`${apiRoutes.categorias.get}?estado=${estado}&page=${page}&limit=${limit}`);

    const { toast, theme } = useContext(ToastContext);
    const { fetchApi } = useApi();

    const getCategories = async () => {
        try{
            const response = await fetchApi(apiURL, 'GET');
            if (response.success) {
                setCategories(response.body.categorias);
                setMaxCount(response.body.maxCount);
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
        Cookies.set('estadoCategorias', estado == 1 ? 0 : 1);
    }

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        if((searchParams.get('page') || 1) != page){
            setSearchParams({ page: page })
        }
        setApiURL(`${apiRoutes.categorias.get}?estado=${estado}&page=${page}&limit=${limit}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, estado]);

    useEffect(() => {
        getCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL]);
    return (
        <AdminLayout title="Categorías - Admin">
            <div className="w-full h-full flex flex-col gap-3 p-3">
                <div className="w-full border-b-2 py-2 flex justify-between items-center">
                    <div className="flex justify-start items-end gap-2">
                        <h1 className="text-2xl font-bold">Categorías</h1>
                        <p className="text-lg font-semibold">({maxCount})</p>
                        <button onClick={changeEstado} 
                            className={`duration-400 border-2 rounded-xl px-2 ${estado == 1 ? 'border-green-600 hover:text-green-600 dark:border-lime-400 dark:hover:text-lime-400' : 'border-red-500 hover:text-red-500'} 
                            cursor-pointer font-semibold`}>{estado == 1 ? 'Activos' : 'Inactivos'}</button>
                    </div>
                    <AddCategoryButton fetchAgain={getCategories} />
                </div>
                <div className="w-full py-2">
                    <div className="w-full grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                        {
                            categories.map((category) => (
                                <CategoryCard category={category} key={category.id} fetchAgain={getCategories} />
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
