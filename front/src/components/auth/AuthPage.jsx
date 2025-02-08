import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import Cookies from 'js-cookie';

export const AuthPage = ({ children, publico = false }) => {
    const { isLogged } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        // Guardar la ruta actual si no está logueado
        if (!isLogged) {
            if (window.location.pathname != '/login' && window.location.pathname != '/register') {
                Cookies.set('current_path', window.location.pathname, { expires: 1/8 });
            }
        } else {
            Cookies.set('current_path', '');
        }
    }, [children, isLogged]);

    useEffect(() => {
        if (!isLogged && !publico) {
            navigate('/login')
        }
    }, [isLogged, navigate, publico]);
    return (
        <>
            {(isLogged || publico) && children}
        </>
    )
}

AuthPage.propTypes = {
    children: PropTypes.node.isRequired,
    publico: PropTypes.bool,
}