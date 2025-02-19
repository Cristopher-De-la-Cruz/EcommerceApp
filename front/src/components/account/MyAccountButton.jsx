import { faUser } from "@fortawesome/free-solid-svg-icons"
import { Modal } from "../Modal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EditNameEmail } from "./EditNameEmail"
import { EditPassword } from "./EditPassword"

export const MyAccountButton = () => {

    return (
        <Modal buttonChildren={<div className="w-[98%] cursor-pointer hover:text-gray-500 py-1 border-t border-white dark:border-gray-300 flex gap-2 items-center text-md px-2">
            <FontAwesomeIcon icon={faUser} /> <p>Mi Perfil</p>
        </div>}>
            <div className="w-full h-full flex flex-col gap-3 p-3">
                <div className="w-full border-b-2 border-zinc-500 py-1 text-center">
                    <h2 className="text-xl font-bold">Editar Perfil</h2>
                </div>
                <div className="w-full flex flex-col gap-3">
                    <div>
                        <EditNameEmail/>
                    </div>
                    <div>
                        <EditPassword/>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
