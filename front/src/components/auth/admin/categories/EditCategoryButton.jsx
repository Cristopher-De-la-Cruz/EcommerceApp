import { PropTypes } from "prop-types"
import { Modal } from "../../../Modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import apiRoutes from "../../../../services/apiRoutes"
import { useApi } from "../../../../hooks/useApi"
import { useContext } from "react"
import { ToastContext } from "../../../../context/Toast/ToastContext"
import { AuthContext } from "../../../../context/Auth/AuthContext"
import { useForm } from "../../../../hooks/useForm"

export const EditCategoryButton = ({ categoria, fetchAgain }) => {
    const { toast, theme } = useContext(ToastContext);
    const { fetchApi, isLoading } = useApi();
    const { token } = useContext(AuthContext);
    const { form, changeForm, onKeyDown } = useForm({ nombre: categoria.nombre });

    const editCategory = async () => {
        try {
            if (form.nombre.trim().length < 3 || form.nombre.trim().length > 50) {
                toast.warning('El nombre debe tener entre 3 y 50 caracteres', { position: 'bottom-right', theme: theme });
                return;
            }
            if (form.nombre.trim() == categoria.nombre.trim()) return;
            const response = await fetchApi(`${apiRoutes.categorias.update}${categoria.id}`, 'PUT', JSON.stringify({nombre: form.nombre.trim()}), token);
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
        <Modal sizeClass="sm:w-lg w-[90%]" buttonChildren={<button className="duration-400 w-full font-semibold cursor-pointer border-2 border-blue-700 py-1 px-2 rounded-2xl hover:scale-105 hover:text-blue-700 flex justify-center items-center gap-1">
            <FontAwesomeIcon icon={faEdit} /> Editar
        </button>}
        >
            <div className="w-full h-full">
                <div className="w-full flex justify-center items-center text-center border-b border-zinc-500 py-1">
                    <h2 className="text-xl font-bold">Editar Categoria ({categoria.id})</h2>
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start py-2">
                        <p>Nombre de la categoría:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, editCategory) }}
                            placeholder="Tecnlogía..." />
                    </div>
                </div>
                <div className="w-full flex justify-center items-center py-2">
                    <button onClick={editCategory} disabled={isLoading} className="duration-400 w-3/4 cursor-pointer font-semibold py-1.5 px-2 border-2 border-blue-700 rounded-2xl 
                        hover:text-blue-700 hover:scale-105 flex justify-center items-center gap-2">
                        <FontAwesomeIcon icon={faEdit} /> Editar
                    </button>
                </div>
            </div>
        </Modal>
    )
}

EditCategoryButton.propTypes = {
    categoria: PropTypes.object,
    fetchAgain: PropTypes.func,
}