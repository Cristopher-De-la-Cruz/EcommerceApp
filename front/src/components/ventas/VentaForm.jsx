import { useForm } from "../../hooks/useForm"
import { useContext } from "react";
import { ToastContext } from "../../context/Toast/ToastContext";
import { useApi } from "../../hooks/useApi";
import apiRoutes from "../../services/apiRoutes";
import { AuthContext } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const initForm = {
    fecha: '',
    lugar_entrega: '',
    numero_tarjeta: '',
    mes: '01',
    año: '25',
    csv: '',
}

export const VentaForm = () => {

    const { form, changeForm } = useForm(initForm);
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const { fetchApi, isLoading } = useApi();

    const handleSubmit = async () => {
        try {
            if (!form.fecha || !form.lugar_entrega || !form.numero_tarjeta || !form.mes || !form.año || !form.csv) {
                toast.warning("Ingrese todos los campos", { position: "bottom-right", theme: theme });
                return;
            }
            const fecha_expiracion = `${form.mes}/${form.año}`;
            
            const response = await fetchApi(apiRoutes.ventas.store, 'POST', JSON.stringify({ ...form, fecha_expiracion }), token);
            if (response.success) {
                toast.success('Compra realizada', { position: "bottom-right", theme: theme });
                navigate('/my-orders')
            } else {
                if (response.status == 400) {
                    response.body.forEach(error => {
                        toast.error(error.message, { position: "bottom-right", theme: theme });
                    });
                } else {
                    toast.error(response.body.message, { position: "bottom-right", theme: theme });
                }
            }
        } catch (error) {
            toast.error('Error al realizar la compra', { position: "bottom-right", theme: theme });
            console.error('Error al realizar la venta:', error);
        }
    }


    return (
        <>
            <div className="bg-white flex flex-col gap-2 items-center py-4 rounded-2xl shadow-xl shadow-slate-300 dark:shadow-black dark:bg-black h-[32rem] min-h-120 w-80 md:w-120">
                <div>
                    <h3 className="text-2xl text-center font-medium">Llena todos los campos para realizar la venta</h3>
                </div>
                <div className="w-[90%] flex justify-center gap-2">
                    <div className="w-5/6">
                        <p className="text-lg font-medium">Fecha de entrega</p>
                        <input className="text-black border-2 py-1 px-2 rounded-2xl bg-white w-full"
                            name="fecha"
                            value={form.fecha}
                            onChange={changeForm}
                            type="date" />
                    </div>
                </div>
                <div className="w-[90%] flex justify-center gap-2">
                    <div className="w-5/6">
                        <p className="text-lg font-medium">Lugar de entrega</p>
                        <input className="text-black border-2 py-1 px-2 rounded-2xl bg-white w-full"
                            name="lugar_entrega"
                            value={form.lugar_entrega}
                            onChange={changeForm}
                            autoComplete="off"
                            type="text" placeholder="Jr. Campo verde #456" />
                    </div>
                </div>
                <div className="w-[90%] flex justify-center gap-2">
                    <div className="w-5/6">
                        <p className="text-lg font-medium">N° de tarjeta</p>
                        <input className="text-black border-2 py-1 px-2 rounded-2xl bg-white w-full"
                            name="numero_tarjeta"
                            value={form.numero_tarjeta}
                            onChange={changeForm}
                            autoComplete="off"
                            type="text" placeholder="4557974125689523" />
                    </div>
                </div>
                <div className="w-[90%] flex justify-center gap-2">
                    <div className="w-5/6">
                        <p className="text-lg font-medium">Caducidad (Mes y Año)</p>
                        <div className="grid grid-cols-2 gap-2 w-full">
                            <select className="text-black border-2 py-1 px-2 rounded-2xl bg-white w-full"
                                name="mes"
                                value={form.mes}
                                onChange={changeForm}
                                type="text">
                                <option value="01">01</option>
                                <option value="02">02</option>
                                <option value="03">03</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                            <select className="text-black border-2 py-1 px-2 rounded-2xl bg-white w-full"
                                name="año"
                                value={form.año}
                                onChange={changeForm}
                                type="text">
                                <option value="25">25</option>
                                <option value="26">26</option>
                                <option value="27">27</option>
                                <option value="28">28</option>
                                <option value="29">29</option>
                                <option value="30">30</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="w-[90%] flex justify-center gap-2">
                    <div className="w-5/6">
                        <p className="text-lg font-medium">CSV</p>
                        <input className="text-black border-2 py-1 px-2 rounded-2xl bg-white w-full"
                            name="csv"
                            value={form.csv}
                            onChange={changeForm}
                            type="text" placeholder="123" />
                    </div>
                </div>
                <div className="w-[90%] flex justify-center items-center">
                    <div className="w-5/6">
                        <button disabled={isLoading} onClick={handleSubmit} className="duration-400 w-full h-10 border-2 hover:bg-black dark:border-lime-400 rounded-2xl cursor-pointer font-semibold dark:hover:bg-lime-400 hover:text-white">
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
