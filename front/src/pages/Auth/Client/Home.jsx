import { useContext, useEffect } from 'react'
import { AuthContext } from '../../../context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const { isLogged, logout } = useContext(AuthContext)
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLogged) {
            navigate('/login')
        }
    }, [isLogged, navigate])
    return (
        <>
            {
                isLogged && <div>
                    <div>home</div>
                    <button onClick={logout}>Logout</button>
                </div>
            }
        </>
    )
}
