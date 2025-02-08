import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { PropTypes } from "prop-types"

export const SideBarItem = ({isOpen, icon, text, path}) => {
    return (
        <div title={text} className={`duration-400 flex justify-start items-center h-9 w-full`}>
            <Link to={path} className={`cursor-pointer w-full h-full hover:bg-zinc-700 ${window.location.pathname == path && 'bg-zinc-700'} text-xl flex ${isOpen ? 'justify-start px-2' : 'justify-center'} items-center gap-2 `}>
                <FontAwesomeIcon className="w-7" icon={icon} />
                {
                    isOpen &&
                    <p className="font-semibold text-lg">{text}</p>
                }
            </Link>
        </div>
    )
}

SideBarItem.propTypes = {
    isOpen: PropTypes.bool,
    icon: PropTypes.object,
    text: PropTypes.string,
    path: PropTypes.string,
}
