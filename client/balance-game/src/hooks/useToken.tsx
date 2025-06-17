import { useEffect, useState } from "react";
export function useToken(){
    const [token, setToken] = useState<string|null>(null);
    
    useEffect(() => {
            const localStorageToken = localStorage.getItem('token');
            setToken(localStorageToken);
    }, [])
    
    return token;
}