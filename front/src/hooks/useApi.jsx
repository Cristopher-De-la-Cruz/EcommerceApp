import { useState } from "react";

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchApi = async (apiUrl = '', method = 'GET', body = {}, token = '', isFormData = false) => {
    setIsLoading(true);
    try {
      const Token = token === '' ? '' : 'Bearer ' + token;
      const headers = isFormData
        ? { 'Authorization': Token }
        : { 'Content-Type': 'application/json', 'Authorization': Token };

      const response = await fetch(apiUrl, {
        method: method,
        headers: isFormData ? headers : headers,
        body: method === 'GET' ? null : body,
      });

      if (!response.ok) {
        return {
          success: false,
          body: { message: 'Error al usar el servicio.', error: response.statusText },
          status: response.status,
        };
      }

      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error('Error al usar el servicio:', error);
      setIsLoading(false);
      return {
        success: false,
        body: { message: 'Error al usar el servicio.', error: error },
        status: 500,
      };
    }
  };

  return {
    fetchApi,
    isLoading,
  };
};
