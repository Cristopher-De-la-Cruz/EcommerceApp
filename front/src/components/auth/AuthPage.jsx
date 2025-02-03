import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';

export const AuthPage = ({children}) => {
    const { isLogged } = useContext(AuthContext)
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogged) {
            navigate('/login')
        }
    }, [isLogged, navigate])
    return (
        <>
            {isLogged && children}
        </>
    )
}

AuthPage.propTypes = {
    children: PropTypes.node.isRequired
}