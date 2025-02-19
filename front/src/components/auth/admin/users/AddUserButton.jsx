import { PropTypes } from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Modal } from "../../../Modal"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import apiRoutes from "../../../../services/apiRoutes"
import { useApi } from "../../../../hooks/useApi"
import { useContext } from "react"
import { ToastContext } from "../../../../context/Toast/ToastContext"
import { AuthContext } from "../../../../context/Auth/AuthContext"
import { useForm } from "../../../../hooks/useForm"
import { InputPassword } from "../../../InputPassword"

export const AddUserButton = ({ fetchAgain }) => {

    const initForm = {
        nombre: '',
        email: '',
        password: '',
        role: 2,
    }

    const { toast, theme } = useContext(ToastContext);
    const { fetchApi, isLoading } = useApi();
    const { token } = useContext(AuthContext);
    const { form, changeForm, onKeyDown, resetForm } = useForm(initForm);

    const addUser = async () => {
        try {
            if (form.nombre.trim() == '' && form.email.trim() == '' && form.password.trim() == '') {
                toast.warning('Ingrese todos los campos.', { position: 'bottom-right', theme: theme });
                return;
            }
            const response = await fetchApi(`${apiRoutes.usuarios.store}`, 'POST', JSON.stringify({...form, role: Number(form.role)}), token);
            if (response.success) {
                resetForm();
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
            toast.error('Error al agregar el usuario', { position: 'bottom-right', theme: theme });
        }
    }

    return (
        <Modal sizeClass="sm:w-lg w-[90%]" buttonChildren={<button className="duration-400 cursor-pointer font-semibold py-1.5 px-2 border-2 border-fuchsia-600 rounded-2xl 
            hover:text-fuchsia-600 hover:scale-105 flex justify-center items-center gap-2">
            <FontAwesomeIcon icon={faSave} /> Agregar
        </button>}
        >
            <div className="w-full h-full">
                <div className="w-full flex justify-center items-center text-center border-b border-zinc-500 py-1">
                    <h2 className="text-xl font-bold">Agregar Usuario</h2>
                </div>
                <div className="w-full flex flex-col justify-center gap-3 items-center py-2">
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Nombre:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, addUser) }}
                            placeholder="User Example..." />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Email:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="text"
                            name="email"
                            value={form.email}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, addUser) }}
                            placeholder="user_example@gmail.com..." />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Password:</p>
                        <InputPassword inputClass="w-full rounded-xl border-2 py-2 px-3" value={form.password} onChange={changeForm} name="password" onKeyDown={(e) => { onKeyDown(e, addUser) }} />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Rol:</p>
                        <select className="w-full rounded-xl border-2 py-2 px-3"
                            name="role" value={form.role} onChange={changeForm} onKeyDown={(e) => { onKeyDown(e, addUser) }}>
                            {
                                [{id: 1, nombre: 'Administrador'}, {id: 2, nombre: 'Cliente'}].map((role) => (
                                    <option className="bg-white text-black dark:bg-zinc-900 dark:text-white" key={role.id} value={role.id}>{role.nombre}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center py-2">
                    <button onClick={addUser} disabled={isLoading} className="duration-400 w-3/4 cursor-pointer font-semibold py-1.5 px-2 border-2 border-fuchsia-600 rounded-2xl 
                        hover:text-fuchsia-600 hover:scale-105 flex justify-center items-center gap-2">
                        <FontAwesomeIcon icon={faSave} /> Agregar
                    </button>
                </div>
            </div>
        </Modal>
    )
}

AddUserButton.propTypes = {
    user: PropTypes.object,
    fetchAgain: PropTypes.func,
}