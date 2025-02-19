import { AdminLayout } from "../../../components/auth/admin/AdminLayout"
import { useContext, useEffect, useState } from "react"
import { ToastContext } from "../../../context/Toast/ToastContext"
import { AuthContext } from "../../../context/Auth/AuthContext"
import apiRoutes from "../../../services/apiRoutes";
import { useApi } from "../../../hooks/useApi";
import Cookies from 'js-cookie';
import { useSearchParams } from "react-router-dom";
import { LimitControl } from "../../../components/LimitControl";
import { PageControl } from "../../../components/PageControl";
import { UserCard } from "../../../components/auth/admin/users/UserCard";
import { AddUserButton } from "../../../components/auth/admin/users/AddUserButton";

export const AdminUsers = () => {

    const { fetchApi } = useApi();
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [maxCount, setMaxCount] = useState(0);
    const [estado, setEstado] = useState(Cookies.get('estadoUsuarios') || 1);

    const [isFirstRender, setIsFirstRender] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const [limit, setLimit] = useState(Number(Cookies.get('limiteUsuarios')) || 12);

    const [apiURL, setApiURL] = useState(`${apiRoutes.usuarios.get}?estado=${estado}&page=${page}&limit=${limit}`);

    const getUsers = async () => {
        try {
            const response = await fetchApi(apiURL, 'GET', null, token);
            if (response.success) {
                setUsers(response.body.usuarios);
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
        Cookies.set('estadoUsuarios', estado == 1 ? 0 : 1);
    }
    const setLimite = (value) => {
        setLimit(value);
        Cookies.set('limiteUsuarios', value);
    }

    useEffect(() => {
        getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiURL]);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        if ((searchParams.get('page') || 1) != page) {
            setSearchParams({ page: page })
        }
        setApiURL(`${apiRoutes.usuarios.get}?estado=${estado}&page=${page}&limit=${limit}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit, estado]);



    return (
        <AdminLayout title="Gest. Usuarios - Admin">
            <div className="w-full h-full flex flex-col gap-3 pb-3 px-3">
                <div className="w-full sticky top-16 py-3 border-b-2 py-2 flex justify-between items-center bg-slate-100 dark:bg-zinc-900">
                    <div className="flex justify-start items-end gap-2">
                        <h1 className="text-2xl font-bold">Usuarios</h1>
                        <p className="text-lg font-semibold">({maxCount})</p>
                        <button onClick={changeEstado}
                            className={`duration-400 border-2 rounded-xl px-2 ${estado == 1 ? 'border-green-600 hover:text-green-600 dark:border-lime-400 dark:hover:text-lime-400' : 'border-red-500 hover:text-red-500'} 
                            cursor-pointer font-semibold`}>{estado == 1 ? 'Activos' : 'Inactivos'}</button>
                    </div>
                    <AddUserButton fetchAgain={getUsers} />
                </div>
                <div className="w-full flex sm:flex-row flex-col py-2">
                    <div className="w-full grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
                        {
                            users.map((user) => (
                                <UserCard key={user.id} user={user} fetchAgain={getUsers}/>
                            ))
                        }
                    </div>
                </div>
                <div className="w-full flex sm:flex-row flex-col justify-between">
                    <LimitControl limit={limit} setLimit={setLimite} />
                    <PageControl pagina={page} setPagina={setPage} maxCount={maxCount} limite={limit} />
                </div>
            </div>
        </AdminLayout>
    )
}
