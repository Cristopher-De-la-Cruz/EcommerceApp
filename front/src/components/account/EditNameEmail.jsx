import { faChevronDown, faChevronRight, faSave } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import { useForm } from "../../hooks/useForm"
import apiRoutes from "../../services/apiRoutes"
import { useApi } from "../../hooks/useApi"
import { useContext } from "react"
import { ToastContext } from "../../context/Toast/ToastContext"
import { AuthContext } from "../../context/Auth/AuthContext"


export const EditNameEmail = () => {

    const { fetchApi, isLoading } = useApi();
    const { token, user, editUser } = useContext(AuthContext);
    const { toast, theme } = useContext(ToastContext);

    const initForm = {
        nombre: user.nombre,
        email: user.email,
    }
    const { form, changeForm, onKeyDown } = useForm(initForm);
    const [isOpen, setIsOpen] = useState(false)

    const editNameEmail = async () => {
        try {
            const response = await fetchApi(`${apiRoutes.usuarios.editNameEmail}`, 'PUT', JSON.stringify(form), token);
            if (response.success) {
                editUser(form.nombre, form.email)
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
            toast.error('Error al editar el nombre y email', { position: 'bottom-right', theme: theme });
        }
    }

    return (
        <div className="">
            <div onClick={() => setIsOpen(!isOpen)} className="w-full border-b border-zinc-500 cursor-pointer flex gap-2 items-center">
                <p className={`text-lg font-semibold ${isOpen ? 'non-italic' : 'italic'}`}>Nombre & email</p>
                <FontAwesomeIcon icon={isOpen ? faChevronDown : faChevronRight} className="text-lg" />
            </div>
            {
                isOpen &&
                <div className="w-full flex flex-col gap-2 py-1 px-3">
                    <div>
                        <p className="text-md italic font-semibold">Nombre:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, editNameEmail) }}
                            autoComplete="off" />
                    </div>
                    <div>
                        <p className="text-md italic font-semibold">Email:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="email"
                            name="email" 
                            value={form.email} 
                            onChange={changeForm} 
                            onKeyDown={(e) => { onKeyDown(e, editNameEmail) }}
                            autoComplete="off" />
                    </div>
                    <div className="w-full flex justify-center py-2">
                        <button onClick={editNameEmail} disabled={isLoading} className="duration-400 w-3/4 rounded-xl bg-blue-500 py-2 px-4 text-white hover:bg-blue-700 cursor-pointer">
                            <FontAwesomeIcon icon={faSave}/> Guardar
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}
