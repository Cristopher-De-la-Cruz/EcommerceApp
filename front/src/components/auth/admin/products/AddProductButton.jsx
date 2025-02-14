import { PropTypes } from "prop-types"
import { Modal } from "../../../Modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSave } from "@fortawesome/free-solid-svg-icons"
import apiRoutes from "../../../../services/apiRoutes"
import { useApi } from "../../../../hooks/useApi"
import { useContext } from "react"
import { ToastContext } from "../../../../context/Toast/ToastContext"
import { AuthContext } from "../../../../context/Auth/AuthContext"
import { useForm } from "../../../../hooks/useForm"

const initForm = {
    nombre: '',
    descripcion: '',
    categoria_id: 1,
    precio: '',
    stock: '',
    imagen: [],
}

export const AddProductButton = ({ fetchAgain, categories }) => {
    const { toast, theme } = useContext(ToastContext);
    const { fetchApi, isLoading } = useApi();
    const { token } = useContext(AuthContext);
    const { form, changeForm, onKeyDown, resetForm } = useForm(initForm);

    const addProduct = async () => {
        const formData = new FormData();

        // Agregar los campos del formulario al FormData
        for (const key in form) {
            if (key === 'imagen') {
                // Si es un arreglo de imágenes, agregar cada archivo al FormData
                for (const file of form[key]) {
                    formData.append('imagen', file);
                }
            } else {
                formData.append(key, form[key]);
            }
        }

        try {
            const response = await fetchApi(
                `${apiRoutes.productos.store}`,
                'POST',
                formData,
                token,
                true // Indica que estamos usando FormData
            );

            if (response.success) {
                resetForm();
                fetchAgain();
                toast.success(response.body.message, { position: 'bottom-right', theme: theme });
            } else {
                if (response.status === 400) {
                    response.body.forEach((error) => {
                        toast.warning(error.message, { position: 'bottom-right', theme: theme });
                    });
                } else {
                    toast.error(response.body.message, { position: 'bottom-right', theme: theme });
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al agregar el producto', { position: 'bottom-right', theme: theme });
        }
    };



    return (
        <Modal sizeClass="sm:w-lg w-[90%]" buttonChildren={<button className="duration-400 cursor-pointer font-semibold py-1.5 px-2 border-2 border-fuchsia-600 rounded-2xl 
                        hover:text-fuchsia-600 hover:scale-105 flex justify-center items-center gap-2">
            <FontAwesomeIcon icon={faSave} /> Agregar
        </button>}
        >
            <div className="w-full h-full">
                <div className="w-full flex justify-center items-center text-center border-b border-zinc-500 py-1">
                    <h2 className="text-xl font-bold">Agregar Producto</h2>
                </div>
                <div className="w-full flex flex-col justify-center gap-3 items-center py-2">
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Nombre:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, addProduct) }}
                            placeholder="Laptop..." />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Descripcion:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="text"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, addProduct) }}
                            placeholder="Laptop Icore 5, 8GB de RAM..." />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Categoría:</p>
                        <select className="w-full rounded-xl border-2 py-2 px-3"
                            name="categoria_id" value={form.categoria_id} onChange={changeForm} onKeyDown={(e) => { onKeyDown(e, addProduct) }}>
                            {
                                categories.map((category) => (
                                    <option className="bg-white text-black dark:bg-zinc-900 dark:text-white" key={category.id} value={category.id}>{category.nombre}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Precio:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="number"
                            name="precio"
                            value={form.precio}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, addProduct) }}
                            placeholder="3500.99" />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Stock:</p>
                        <input className="w-full rounded-xl border-2 py-2 px-3"
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={changeForm}
                            onKeyDown={(e) => { onKeyDown(e, addProduct) }}
                            placeholder="100" />
                    </div>
                    <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                        <p>Imágenes:</p>
                        <input
                            className="w-full rounded-xl border-2 py-2 px-3"
                            type="file"
                            multiple
                            name="imagen"
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                changeForm({ target: { name: 'imagen', value: files } });
                            }}
                        />
                    </div>
                </div>
                <div className="w-full flex justify-center items-center py-2">
                    <button onClick={addProduct} disabled={isLoading} className="duration-400 w-3/4 cursor-pointer font-semibold py-1.5 px-2 border-2 border-fuchsia-600 rounded-2xl 
                        hover:text-fuchsia-600 hover:scale-105 flex justify-center items-center gap-2">
                        <FontAwesomeIcon icon={faSave} /> Agregar
                    </button>
                </div>
            </div>
        </Modal>
    )
}

AddProductButton.propTypes = {
    fetchAgain: PropTypes.func,
    categories: PropTypes.array,
}