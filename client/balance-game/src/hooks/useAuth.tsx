import { useEffect , useState } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";


interface MyJwtPayload extends JwtPayload {
  user_id: number;
  login_id: string;
  username: string;
}


export function useAuth(){
    const [user, setUser] = useState<MyJwtPayload | null>(null);
      useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) return;

        try {
            const decoded = jwtDecode<MyJwtPayload>(token);
            setUser(decoded);
        } catch (error) {
            console.error("토큰 디코딩 실패", error);
        }
        
      }, [])
    
      return user;
}