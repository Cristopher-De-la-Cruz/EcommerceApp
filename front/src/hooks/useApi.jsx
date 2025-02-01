
export const useApi = () => {
  const fetchApi = async (apiUrl = '', method = 'GET', body = {}, token = '') => {
    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: body,
        
      });
      if (!response.ok) {
        return {success: false, body: {message: 'Error al usar el servicio.', error: response.statusText}, status: response.status};
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return {success: false, body: {message: 'Error al usar el servicio.', error: error}, status: 500};
    }
  }
  return {
    fetchApi
  }
}
