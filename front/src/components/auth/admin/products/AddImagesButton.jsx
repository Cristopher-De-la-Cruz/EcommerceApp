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

export const AddImagesButton = ({ fetchAgain, producto, cantImgActivas }) => {

    const initForm = {
        imagenes: [],
        producto_id: producto.id,
    }
    const { toast, theme } = useContext(ToastContext);
    const { fetchApi, isLoading } = useApi();
    const { token } = useContext(AuthContext);
    const { form, changeForm, resetForm } = useForm(initForm);

    const addProduct = async () => {
        const formData = new FormData();

        // Agregar los campos del formulario al FormData
        for (const key in form) {
            if (key === 'imagenes') {
                // Si es un arreglo de imágenes, agregar cada archivo al FormData
                for (const file of form[key]) {
                    formData.append('imagenes', file);
                }
            } else {
                formData.append(key, form[key]);
            }
        }

        try {
            const response = await fetchApi(
                `${apiRoutes.productos.addImages}`,
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
            toast.error('Error al agregar imagenes', { position: 'bottom-right', theme: theme });
        }
    };



    return (
        <>
            {
                cantImgActivas < 10 &&
                <Modal sizeClass="sm:w-lg w-[90%]" buttonChildren={<button className="duration-400 cursor-pointer font-semibold py-1.5 px-2 border-2 border-fuchsia-600 rounded-2xl 
                            hover:text-fuchsia-600 hover:scale-105 flex justify-center items-center gap-2">
                    <FontAwesomeIcon icon={faSave} /> Agregar
                </button>}
                >
                    <div className="w-full h-full">
                        <div className="w-full flex justify-center items-center text-center border-b border-zinc-500 py-1">
                            <h2 className="text-xl font-bold">Agregar Imagenes</h2>
                        </div>
                        <div className="w-full flex flex-col justify-center gap-3 items-center py-2">
                            <div className="w-3/4 flex flex-col gap-3 justify-center items-start">
                                <p>Imágenes (Máximo {10 - cantImgActivas}):</p>
                                <input
                                    className="w-full rounded-xl border-2 py-2 px-3"
                                    type="file"
                                    multiple
                                    name="imagenes"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        changeForm({ target: { name: 'imagenes', value: files } });
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
            }
        </>
    )
}

AddImagesButton.propTypes = {
    fetchAgain: PropTypes.func,
    producto: PropTypes.object,
    cantImgActivas: PropTypes.number,
}