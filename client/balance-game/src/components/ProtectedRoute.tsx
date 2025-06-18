import { Navigate } from "react-router-dom";
import { useAuthQuery } from "../query/useAuthQuery";

interface Props{
    children : React.ReactNode;
}

export const ProtectedRoute = ({children} : Props) => {
    const {data: user, isLoading} = useAuthQuery();

    if(isLoading) return <div>로딩 중...</div>;

    if(!user) {
        return <Navigate to="/login" replace/>
    }

    //로그인 되어있으면 children 렌더링
    return <div>{children}</div>
}