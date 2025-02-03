import { useApi } from "../../hooks/useApi"
import { useForm } from "../../hooks/useForm"
import { ToastContainer, toast } from 'react-toastify';
import { useContext } from "react";
import { ThemeContext } from "../../context/Theme/ThemeContext";
import { AuthContext } from "../../context/Auth/AuthContext";
import { InputPassword } from "../InputPassword";
import apiRoutes from '../../services/apiRoutes';


const initForm = {
    nombre: '',
    email: '',
    password: '',
}
export const RegisterForm = () => {

    const { fetchApi } = useApi();
    const { form, changeForm } = useForm(initForm);
    const { theme } = useContext(ThemeContext);
    const { login } = useContext(AuthContext);

    const handleSubmit = async () => {
        try {
            // validar formulario
            if (!form.email || !form.password || !form.nombre) {
                toast.warning("Ingrese su nombre, email y contraseña", { position: "bottom-right", theme: theme });
                return;
            } else if (form.nombre.length < 3) {
                toast.warning("El nombre debe tener al menos 3 caracteres", { position: "bottom-right", theme: theme });
                return;
            } else if (form.email.length < 5) {
                toast.warning("El email debe tener al menos 5 caracteres", { position: "bottom-right", theme: theme });
                return;
            } else if (form.password.length < 8) {
                toast.warning("El email debe tener al menos 8 caracteres", { position: "bottom-right", theme: theme });
                return;
            }

            const data = await fetchApi(apiRoutes.usuarios.register, 'POST', JSON.stringify(form));
            console.log(data);
            if (data.success) {
                toast.success(data.body.message, { position: "bottom-right", theme: theme });
                const logged = login({ nombre: data.body.user.nombre, email: data.body.user.email, role: data.body.user.role }, data.body.token);
                console.log(logged);
                if (!logged.success) {
                    toast.error('Ha ocurrido un error.', { position: "bottom-right", theme: theme });
                    return;
                }
            } else {
                if (data.status == 400) {
                    data.body.forEach((message) => {
                        if (message.message == 'email debe ser único.') message.message = 'El email ingresado ya está registrado.';
                        toast.warning(message.message, {
                            position: "bottom-right",
                            theme: theme
                        });
                    });
                } else {
                    toast.error(data.body.message, { position: "bottom-right", theme: theme });
                }
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };


    return (
        <>
            <div className="flex flex-col gap-5">
                <div>
                    <p>Nombre</p>
                    <input type="text"
                        className="bg-transparent border-2 rounded-md py-1 px-2 w-full"
                        name="nombre"
                        value={form.nombre}
                        onChange={changeForm}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <p>Email</p>
                    <input type="text"
                        className="bg-transparent border-2 rounded-md py-1 px-2 w-full"
                        name="email"
                        value={form.email}
                        onChange={changeForm}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <p>Password</p>
                    <InputPassword value={form.password} onChange={changeForm} />

                </div>
                {/* <div className="flex justify-center items-center gap-2">
                    <p className="text-xs">Mantener Sesión</p>
                    <input type="checkbox" />
                </div> */}
                <div className="flex justify-center">
                    <button className="duration-300 w-3/4 text-white bg-zinc-950 hover:scale-115 ease-out cursor-pointer font-bold border-2 border-black py-1.5 px-3 rounded-full"
                        onClick={handleSubmit}>Registrar Cuenta</button>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
