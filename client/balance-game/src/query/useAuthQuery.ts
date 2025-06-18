import {useQuery} from '@tanstack/react-query';
import { jwtDecode, type JwtPayload } from 'jwt-decode';


interface MyJwtPayload extends JwtPayload {
    user_id: number;
    login_id: string;
    username: string;
  }
  
export const useAuthQuery = () => {
    return useQuery({
        queryKey: ['me'],
        queryFn: async (): Promise<MyJwtPayload> => {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('NO_TOKEN');
    
          try {
            const decoded = jwtDecode<MyJwtPayload>(token);
            return decoded;
          } catch {
            throw new Error('INVALID_TOKEN');
          }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
      });
}  
