import { RenderWithAnimation } from "./RenderWithAnimation"
import { PropTypes } from "prop-types"

export const Modal = ({children = <></>, buttonChildren = <button>Modal</button>, sizeClass = 'sm:w-lg w-[90%]', closeOnOverlayClick = true, overlay = true}) => {
    return (
        <RenderWithAnimation buttonChildren={buttonChildren} 
            contClass={`duration-600 absolute z-50 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                text-black bg-zinc-300 dark:bg-black ${sizeClass} dark:text-white transition-all ease-out p-4 rounded-xl
                shadow-2xl shadow-zinc-400 dark:shadow-zinc-900`}
            renderAnimationClass="opacity-100 scale-100"
            exitAnimationClass="opacity-0 -translate-y-30 scale-80"
            closeButton={true}
            closeOnOverlayClick={closeOnOverlayClick}
            overlay={overlay}
            >
                <div className="w-full h-full">
                    { children }
                </div>
        </RenderWithAnimation>
    )
}

Modal.propTypes = {
    children: PropTypes.node,
    buttonChildren: PropTypes.node,
    sizeClass: PropTypes.string,
    closeOnOverlayClick: PropTypes.bool,
    overlay: PropTypes.bool,
}