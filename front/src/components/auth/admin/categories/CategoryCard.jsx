import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropTypes } from 'prop-types'
import { EditCategoryButton } from './EditCategoryButton'
import apiRoutes from "../../../../services/apiRoutes"
import { useApi } from "../../../../hooks/useApi"
import { useContext } from "react"
import { ToastContext } from "../../../../context/Toast/ToastContext"
import { AuthContext } from "../../../../context/Auth/AuthContext"

export const CategoryCard = ({ category, fetchAgain }) => {

    const { toast, theme } = useContext(ToastContext);
    const { fetchApi, isLoading } = useApi();
    const { token } = useContext(AuthContext);

    const toggleCategoryState = async () => {
        try {
            if(!category.id){
                toast.warning('No se puede cambiar el estado de una categoría sin id', { position: 'bottom-right', theme: theme });
                return;
            }
            const response = await fetchApi(`${apiRoutes.categorias.toggleState}${category.id}`, 'PUT', JSON.stringify({}), token);
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
                    <h2 className="text-xl font-semibold">{category.id}</h2>
                    <h2 className="text-lg font-medium">{category.nombre}</h2>
                </div>
                <div className="w-full flex flex-col gap-1 border-b border-zinc-300 py-1">
                    <div className="flex gap-2">
                        <p className="text-md font-semibold">Creado: </p>
                        <p className="text-md font-bold">{new Date(category.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="text-md font-semibold">Editado: </p>
                        <p className="text-md font-bold">{new Date(category.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className='w-full grid grid-cols-2 gap-2 py-1'>
                    <EditCategoryButton categoria={category} fetchAgain={fetchAgain} />
                    <button onClick={toggleCategoryState} disabled={isLoading} className={`duration-400 font-semibold cursor-pointer border-2 
                        ${category.estado == 1 ? 'border-red-600 hover:text-red-600' : 'dark:border-lime-400 dark:hover:text-lime-400 border-green-500 hover:text-green-500'} 
                        py-1 px-2 rounded-2xl hover:scale-105 flex justify-center items-center gap-1`}>
                        <FontAwesomeIcon icon={category.estado == 1 ? faMinus : faPlus} /> {category.estado == 1 ? 'Inactivar' : 'Activar'}
                    </button>
                </div>
            </div>
        </>
    )
}

CategoryCard.propTypes = {
    category: PropTypes.object,
    fetchAgain: PropTypes.func,
}