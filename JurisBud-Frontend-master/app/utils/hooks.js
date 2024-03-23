import {apiClient} from './api.js';
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem('token'));
  const [username, setUsername] = useState('');

  useEffect(
    () => {
      async function checkToken()
      {
        const token = localStorage.getItem("token");
        console.log('token:', token);
        if (!token)
          return;
        if (token && username)
        {
          setIsAuth(true);
          return;
        }
        if (token)
          setIsAuth(true);
        try {
          const response = await apiClient.get('/check_token', {
            headers:
            {
              'Authorization': 'Token ' + token,
              'Accept': 'application/json',
            }
          });
          const data = await response.json();
          if (!response.ok)
          {
            localStorage.removeItem('token');
            setIsAuth(false);
            return;
          }
          console.log(data.username);
          setIsAuth(true);
          setUsername(data.username);
        }
        catch (err) {}
      }
      checkToken();
    },
    []
  );

  return [isAuth, setIsAuth, username, setUsername];
};

export {
  useAuth
};