import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropTypes } from 'prop-types'
import apiRoutes from '../../../../services/apiRoutes'
import { useApi } from '../../../../hooks/useApi'
import { useContext } from 'react'
import { ToastContext } from '../../../../context/Toast/ToastContext'
import { AuthContext } from '../../../../context/Auth/AuthContext'
import { EditUserButton } from './EditUserButton'


export const UserCard = ({user, fetchAgain}) => {
    const { toast, theme } = useContext(ToastContext);
    const { fetchApi, isLoading } = useApi();
    const { token } = useContext(AuthContext);

    const toggleUserState = async () => {
        try {
            if(!user.id){
                toast.warning('No se puede cambiar el estado de un usuario sin id', { position: 'bottom-right', theme: theme });
                return;
            }
            const response = await fetchApi(`${apiRoutes.usuarios.toggleState}${user.id}`, 'PUT', JSON.stringify({}), token);
            if (response.success) {
                fetchAgain();
                toast.success(response.body.message, { position: 'bottom-right', theme: theme });
            } else {
                if (response.status == 400) {
                    response.body.forEach((error) => {
                        toast.warning(error.message, { position: 'bottom-right', theme: theme });
                    });
                } else {
                    toast.error(response.body.message, { position: 'bottom-right', theme: theme });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al editar la categoría', { position: 'bottom-right', theme: theme });
        }
    }

    return (
        <>
            <div className="w-full p-2 rounded-xl shadow-xl shadow-zinc-500 dark:shadow-black flex flex-col gap-1">
                <div className="w-full flex justify-start items-end gap-2 border-b border-zinc-300 py-1">
                    <h2 className="text-xl font-semibold">{user.id}</h2>
                    <h2 title={user.nombre} className="text-lg font-medium truncate">{user.nombre}</h2>
                </div>
                <div className="w-full flex flex-col gap-1 border-b border-zinc-300 py-1">
                    <div title={user.email} className="flex gap-2">
                        <p className="text-md font-semibold">Email: </p>
                        <p className="text-md font-bold truncate">{user.email}</p>
                    </div>
                    <div title={user.email} className="flex gap-2">
                        <p className="text-md font-semibold">Rol: </p>
                        <p className="text-md font-bold truncate">{user.role == 1 ? 'Administrador' : 'Cliente'}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="text-md font-semibold">Creado: </p>
                        <p className="text-md font-bold">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className='w-full grid grid-cols-2 gap-2 py-1'>
                    <EditUserButton user={user} fetchAgain={fetchAgain} />
                    <button onClick={toggleUserState} disabled={isLoading} className={`duration-400 font-semibold cursor-pointer border-2 
                                ${user.estado == 1 ? 'border-red-600 hover:text-red-600' : 'dark:border-lime-400 dark:hover:text-lime-400 border-green-500 hover:text-green-500'} 
                                py-1 px-2 rounded-2xl hover:scale-105 flex justify-center items-center gap-1`}>
                        <FontAwesomeIcon icon={user.estado == 1 ? faMinus : faPlus} /> {user.estado == 1 ? 'Bannear' : 'Activar'}
                    </button>
                </div>
            </div>
        </>
    )
}

UserCard.propTypes = {
    user: PropTypes.object,
    fetchAgain: PropTypes.func,
}