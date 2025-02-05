
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useContext, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PropTypes } from 'prop-types';
import apiRoutes from "../../services/apiRoutes";
import { useApi } from "../../hooks/useApi";
import { AuthContext } from "../../context/Auth/AuthContext";
import { ToastContext } from "../../context/Toast/ToastContext";

export const CarCantControl = ({ carrito_id = 0, maxCant = 0, defaultCant = 1, fetchAgain }) => {
    const [cant, setCant] = useState(defaultCant);
    const [clicked, setClicked] = useState(0);
    const [prevCant, setPrevCant] = useState(cant);
    const { fetchApi, isLoading } = useApi();
    const { toast, theme } = useContext(ToastContext);
    const { token } = useContext(AuthContext);
    const apiChangeCant = `${apiRoutes.carrito.changeCantidad}${carrito_id}`;

    let optionCant = [];
    for (let i = 0; i <= maxCant; i++) {
        optionCant.push(i);
    }

    const handleCantChange = async () => {
        const response = await fetchApi(apiChangeCant, 'PUT', JSON.stringify({ cantidad: cant }), token);
        if (response.success) {
            setPrevCant(cant);
            if(cant == 0){
                fetchAgain();
            }
        } else {
            setCant(prevCant);
            if (response.status == 400) {
                response.body.forEach(error => {
                    toast.error(error.message, { position: 'bottom-right', theme: theme });
                });
            } else {
                toast.error(response.message, { position: 'bottom-right', theme: theme });
            }
        }
    }

    const add = async () => {
        if (cant >= maxCant) {
            return;
        }
        setCant(cant + 1);
        setClicked(clicked + 1);
    }

    const minus = () => {
        if (cant <= 0) {
            return;
        }
        setCant(cant - 1);
        setClicked(clicked + 1);
    }

    const changeSelect = (e) => {
        setCant(Number(e.target.value));
        setClicked(clicked + 1);
    }

    useEffect(() => {
        console.log(clicked)
        if(clicked != 0){
            handleCantChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clicked])

    return (
        <>
            <div disabled={isLoading} className="h-12 w-full border-2 rounded-full flex justify-around items-center">
                <button className="cursor-pointer duration-300 hover:scale-105 hover:text-red-500"><FontAwesomeIcon icon={cant > 1 ? faMinus : faTrash} onClick={minus} /></button>
                <select value={cant} onChange={(e) => changeSelect(e)}>
                    {
                        optionCant.map((cant, index) => (
                            <option className="bg-white text-black dark:bg-black dark:text-white" key={index} value={cant}>{cant}</option>
                        ))
                    }
                </select>
                <button className="cursor-pointer duration-300 hover:scale-105 hover:text-green-500"><FontAwesomeIcon icon={faPlus} onClick={add} /></button>
            </div>
        </>
    )
}

CarCantControl.propTypes = {
    carrito_id: PropTypes.number,
    maxCant: PropTypes.number,
    defaultCant: PropTypes.number,
    fetchAgain: PropTypes.func,
}
