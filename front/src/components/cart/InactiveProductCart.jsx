import { PropTypes } from 'prop-types'
import { useContext } from 'react'
import { AuthContext } from '../../context/Auth/AuthContext'
import apiRoutes from '../../services/apiRoutes'
import { useApi } from '../../hooks/useApi'
import { ToastContext } from '../../context/Toast/ToastContext'



export const InactiveProductCart = ({carrito_id = 0,children, fetchAgain}) => {
    const { token } = useContext(AuthContext)
    const { toast, theme } = useContext(ToastContext)

    const apiInactive = `${apiRoutes.carrito.inactivate}${carrito_id}`;
    const { fetchApi, isLoading } = useApi();
    const Inactivate = async() => {
        try{
            const response = await fetchApi(apiInactive, 'PUT', null, token);
            if(response.success){
                fetchAgain();
            } else {
                if(response.status == 400){
                    response.body.forEach(error => {
                        toast.error(error.message, { position: 'bottom-right', theme: theme });
                    });
                } else {
                    toast.error(response.body.message, { position: 'bottom-right', theme: theme });
                }
            }
        } catch (error) {
            console.error(error)
            toast.error('Ha ocurrido un error', { position: 'bottom-right', theme: theme });
        }
    }

    return (
        <button onClick={() => Inactivate()} disabled={isLoading} className="duration-300 text-md hover:text-red-500 cursor-pointer">
            {children}
        </button>
    )
}

InactiveProductCart.propTypes = {
    carrito_id: PropTypes.number,
    children: PropTypes.node,
    fetchAgain: PropTypes.func,
}