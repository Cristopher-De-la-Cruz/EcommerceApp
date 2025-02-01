import { useState } from 'react';
import { ThemeContext } from './ThemeContext';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Cookies.get('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    Cookies.set('theme', newTheme /*, {expires: 1/48}*/); // Se borrará la cookie en media hora 48 partes de un día (24 horas)
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
