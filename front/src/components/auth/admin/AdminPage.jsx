import { useContext } from 'react'
import { AuthContext } from '../../../context/Auth/AuthContext';
import { PropTypes } from 'prop-types';
import { AuthPage } from '../AuthPage';
import { NoPage } from '../../../pages/NoPage' 
import bcrypt from 'bcryptjs'

export const AdminPage = ({children}) => {
    const { user } = useContext(AuthContext)

    return (
        <AuthPage>
            {bcrypt.compareSync('1', `${user.role}`) ? children : <NoPage/>}
        </AuthPage>
    )
}

AdminPage.propTypes = {
    children: PropTypes.node.isRequired
}