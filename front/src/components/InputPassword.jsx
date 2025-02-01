import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export const InputPassword = ({ value, onChange, name = "password" }) => {
    const [IsShowing, setIsShowing] = useState(false);
    return (
        <div className='relative'>
            <input type={IsShowing ? 'text' : 'password'}
                className="bg-transparent border-2 rounded-md py-1 px-2 w-full"
                name={name}
                value={value}
                onChange={onChange}
            />
            <button className='duration-300 absolute rounded-full bg-transparent right-2 top-1/2 transform -translate-y-1/2 text-black hover:text-zinc-600 dark:text-white dark:hover:text-zinc-400 cursor-pointer text-xl py-1.5 px-2'
                onClick={() => setIsShowing(!IsShowing)}
                type='button'>
                <FontAwesomeIcon icon={IsShowing ? faEyeSlash : faEye}/>
            </button>
        </div>
    )
}

InputPassword.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string,
}