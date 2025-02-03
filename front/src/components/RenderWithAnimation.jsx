import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";

export const RenderWithAnimation = ({ buttonChildren, buttonClass = "", contClass = "", renderAnimationClass = "", exitAnimationClass = "", children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timeout = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    return (
        <>
            <button onClick={() => setIsOpen(!isOpen)} className={buttonClass}>
                {buttonChildren}
            </button>
            {isVisible && (
                <div
                    className={`${contClass} ${isAnimating ? renderAnimationClass : exitAnimationClass
                        }`}
                >
                    {children}
                </div>
            )}
        </>
    )
}

RenderWithAnimation.propTypes = {
    buttonChildren: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    buttonClass: PropTypes.string,
    contClass: PropTypes.string,
    renderAnimationClass: PropTypes.string,
    exitAnimationClass: PropTypes.string,
}
