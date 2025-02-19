import { AuthContext } from "./AuthContext";
import { useState } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs'

const initUser = {
    nombre: '',
    email: '',
    rol: ''
};

export const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(Cookies.get('isLogged') === 'true'); // Convertir a booleano
    const [user, setUser] = useState(() => {
        const userCookie = Cookies.get('user');
        return userCookie ? JSON.parse(userCookie) : initUser;
    });
    const [token, setToken] = useState(Cookies.get('token') || '');

    const login = (newUser, newToken) => {
        try {
            if (!newUser) {
                return { success: false, message: 'Ingrese usuario', status: 400 };
            } else if (!newUser.nombre || !newUser.email || !newUser.role) {
                return { success: false, message: 'Ingrese nombre, email y rol', status: 400 };
            }
            if (!newToken) {
                return { success: false, message: 'Ingrese token', status: 400 };
            }
            const encryptedRole = bcrypt.hashSync(`${newUser.role}`, 10);
            newUser.role = encryptedRole;
            setIsLogged(true);
            Cookies.set('isLogged', true);
            setUser(newUser);
            Cookies.set('user', JSON.stringify(newUser)); // Serializar usuario
            setToken(newToken);
            Cookies.set('token', newToken);
            return { success: true, message: 'Logeado', status: 200 };
        } catch (error) {
            return { success: false, message: 'Error al iniciar sesión', error: error, status: 500 };
        }
    };

    const logout = () => {
        try {
            setIsLogged(false);
            Cookies.set('isLogged', false);
            setUser(initUser);
            Cookies.set('user', JSON.stringify(initUser)); // Serializar usuario vacío
            setToken('');
            Cookies.set('token', '');
            return { success: true, message: 'Sesión cerrada', status: 200 };
        } catch (error) {
            return { success: false, message: 'Error al cerrar sesión', error: error, status: 500 };
        }
    };

    const editUser = (nombre, email) => {
        try{
            const newUser = {...user, nombre: nombre, email: email}
            setUser(newUser);
            Cookies.set('user', JSON.stringify(newUser));
            return { success: true, message: 'Usuario actualizado', status: 200 };
        } catch(error){
            return { success: false, message: 'Error al editar usuario', error: error, status: 500}
        }
    }

    return (
        <AuthContext.Provider value={{ user, editUser, token, isLogged, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};
