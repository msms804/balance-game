import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import {useAuthQuery} from '../query/useAuthQuery'
import { queryClient } from '../query/queryClient';

const NavBar = () => {
    const user = useAuth();
    const navigate = useNavigate();
    //로그아웃 누르면? 
    // 1. 로컬스토리지에서 토큰 없앤다
    // 2. useAuth 훅 다시 호출
    // 3. 다시 로그인 버튼이 렌더링 될 수 있도록
    const {data: myData, isLoading} = useAuthQuery();
    const handleLogout = () => {
      console.log("로그아웃 중 ...")
      localStorage.removeItem('token');
      queryClient.removeQueries({queryKey: ['me']});
    }
    const toLogin = () => {
      navigate('/login');
    }
     useEffect(() => {
      if (myData && !isLoading)
      console.log(myData);
     }, [myData, isLoading]);
      

  return (
    <nav className="flex justify-between items-center bg-zinc-800 p-4 ">
      <NavLink to="/" className="text-2xl font-semibold text-white">밸런스게임</NavLink>
      <div className="flex space-x-4">
      <NavLink to="/submit" >
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">등록</button>
      </NavLink>
      <NavLink to="/login">
      {isLoading ? (
        <div>로딩중...</div>
      ) : myData ? (
        <button className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-600"onClick={handleLogout}>로그아웃</button>
      ) : (
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={toLogin}>로그인</button>
      )}
      </NavLink>
      </div>
    </nav>
    
  );
};

export default NavBar;
