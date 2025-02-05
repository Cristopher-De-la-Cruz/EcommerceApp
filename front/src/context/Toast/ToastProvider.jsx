import { ToastContext } from "./ToastContext"
import { toast, ToastContainer } from "react-toastify";
import { PropTypes } from 'prop-types';
import { useContext } from "react";
import { ThemeContext } from "../Theme/ThemeContext";

export const ToastProvider = ({ children }) => {
    const { theme } = useContext(ThemeContext);
    return (
        <ToastContext.Provider value={{toast, theme}}>
            <>
                {children}
                <ToastContainer />
            </>
        </ToastContext.Provider>
    )
}

ToastProvider.propTypes = {
    children: PropTypes.node,
}