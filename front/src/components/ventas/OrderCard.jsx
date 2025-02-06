import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'
import CryptoJS from 'crypto-js'

export const OrderCard = ({ order }) => {
    const total = order.detalle.reduce((acum, item) => {
        return acum + item.precio * item.cantidad
    }, 0)
    const unidades = order.detalle.reduce((acum, item) => {
        return acum + item.cantidad
    }, 0)

    const secretKey = 'mi_clave_secreta';
    const encryptedId = CryptoJS.AES.encrypt(`${order.id}`, secretKey).toString();
    const redirectLink = `/my-order/${encodeURIComponent(encryptedId)}`;

    return (
        <Link to={redirectLink} className="w-full flex flex-col hover:shadow-lg shadow-zinc-400 dark:shadow-zinc-950 rounded-xl cursor-pointer">
            <div className="flex flex-col border-b w-full py-1 px-2">
                <p className="text-xs font-thin">{new Date(order.fecha).toLocaleDateString()}</p>
                <p title={order.lugar_entrega} className="text-xs font-medium truncate">{order.lugar_entrega}</p>
            </div>
            <div className="flex flex-col py-1 px-2">
                <div className="flex items-end gap-2">
                    <p className="text-md font-medium">Cant. Productos: </p>
                    <p className="text-lg font-bold">{order.detalle.length}</p>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-md font-medium">Unidades: </p>
                    <p className="text-lg font-bold">{unidades}</p>
                </div>
                <div className="flex items-end gap-2">
                    <p className="text-md font-medium">Total: </p>
                    <p className="text-xl font-bold">S/.{total}</p>
                </div>
            </div>

        </Link>
    )
}

OrderCard.propTypes = {
    order: PropTypes.object,
}