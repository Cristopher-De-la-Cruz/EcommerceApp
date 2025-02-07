import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import ReactDOM from "react-dom";

export const RenderWithAnimation = ({
    buttonChildren,
    buttonClass = "",
    contClass = "",
    contStyle = {},
    renderAnimationClass = "",
    exitAnimationClass = "",
    children,
    closeButton = false,
    overlay = true, // Mostrar overlay
    closeOnOverlayClick = true, // Cerrar al hacer clic fuera del modal
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const TCont = document.getElementById("TCont");

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 100);
        } else {
            setIsAnimating(false);
            const timeout = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // Manejar el clic en el overlay
    const handleOverlayClick = () => {
        if (closeOnOverlayClick) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Botón para abrir/cerrar el modal */}
            <div onClick={() => setIsOpen(!isOpen)} className={`${buttonClass}`}>
                {buttonChildren}
            </div>

            {/* Renderizar el modal en el contenedor */}
            {isVisible &&
                ReactDOM.createPortal(
                    <div>
                        {/* Overlay opcional */}
                        {overlay && (
                            <div
                                onClick={handleOverlayClick}
                                className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-80"
                            ></div>
                        )}

                        {/* Contenido del modal */}
                        <div
                            style={contStyle}
                            className={`z-100 ${contClass} ${isAnimating ? renderAnimationClass : exitAnimationClass
                                }`}
                        >
                            <div className="w-full h-full relative">
                                {/* Botón de cerrar si está habilitado */}
                                {closeButton && (
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="duration-400 absolute top-0 right-0 text-black dark:text-white hover:text-gray-500 cursor-pointer text-md"
                                    >
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                )}
                                {children}
                            </div>
                        </div>
                    </div>
                    //     <div
                    //     style={contStyle}
                    //     className={`${contClass} ${
                    //       isAnimating ? renderAnimationClass : exitAnimationClass
                    //     }`}
                    //   >
                    //     <div className="w-full h-full relative">
                    //       {/* Botón de cerrar si está habilitado */}
                    //       {closeButton && (
                    //         <button
                    //           onClick={() => setIsOpen(false)}
                    //           className="duration-400 absolute top-0 right-0 text-black dark:text-white hover:text-gray-500 cursor-pointer text-md"
                    //         >
                    //           <FontAwesomeIcon icon={faX} />
                    //         </button>
                    //       )}
                    //       {children}
                    //     </div>
                    //   </div>
                    ,
                    TCont // Contenedor donde se monta el portal
                )}
        </>
    );
};

RenderWithAnimation.propTypes = {
    buttonChildren: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    buttonClass: PropTypes.string,
    contClass: PropTypes.string,
    contStyle: PropTypes.object,
    renderAnimationClass: PropTypes.string,
    exitAnimationClass: PropTypes.string,
    closeButton: PropTypes.bool,
    overlay: PropTypes.bool, // Muestra el overlay si es true
    closeOnOverlayClick: PropTypes.bool, // Cierra el modal al hacer clic en el overlay si es true
};
