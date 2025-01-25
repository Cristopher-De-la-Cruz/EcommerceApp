import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
import {PropTypes} from 'prop-types'
export const Theme = ({ children }) => {
    const { theme } = useContext(ThemeContext)
    return (
        <div className={theme}>
            {children}
        </div>
    )
}
Theme.propTypes = {
    children: PropTypes.node.isRequired,
}