import { useContext } from 'react'
import { AuthContext } from '../../../context/Auth/AuthContext';
import { PropTypes } from 'prop-types';
import { AuthPage } from '../AuthPage';
import { NoPage } from '../../../pages/NoPage' 
import bcrypt from 'bcryptjs'

export const ClientPage = ({children, publico = false}) => {
    const { user } = useContext(AuthContext)
    return (
        <AuthPage publico={publico}>
            <>
                {(bcrypt.compareSync('2', `${user.role}`) || user.role == undefined)&& children}
                {bcrypt.compareSync('1', `${user.role}`) && <NoPage/>}
            </>
        </AuthPage>
    )
}

ClientPage.propTypes = {
    children: PropTypes.node.isRequired,
    publico: PropTypes.bool,
}