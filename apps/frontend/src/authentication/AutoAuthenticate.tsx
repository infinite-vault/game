import axios from 'axios';
import { useSetAtom } from 'jotai';
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../routing/AppRoutes';
import { authAtom } from '../store/authState';
import { getServerHttpUrl } from '../utils/domains';

interface AutoAuthenticateProps {
  children: ReactNode | ReactNode[];
}

export const AutoAuthenticate = ({ children }: AutoAuthenticateProps) => {
  const setAuth = useSetAtom(authAtom);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`${getServerHttpUrl()}/login`, undefined, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setAuth(data.id);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Login error', err);
        navigate(RoutePaths.ROOT);
      });
  }, []);

  return isLoading ? <div>Loading...</div> : <>{children}</>;
};
