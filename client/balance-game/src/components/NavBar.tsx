import React, { useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const NavBar = () => {
    const user = useAuth();
    const navigate = useNavigate();
    //로그아웃 누르면? 
    // 1. 로컬스토리지에서 토큰 없앤다
    // 2. useAuth 훅 다시 호출
    // 3. 다시 로그인 버튼이 렌더링 될 수 있도록
      const handleLogout = () => {
        localStorage.removeItem('token');
        // 이후에 원하면 페이지 이동
      }
      useEffect(() => {}, [user])
      
  return (
    <nav className="flex justify-between items-center bg-zinc-800 p-4 ">
      <NavLink to="/" className="text-2xl font-semibold text-white">Logo</NavLink>
      <div className="flex space-x-4">
      <NavLink to="/submit" >
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">등록</button>
      </NavLink>
      <NavLink to="/login">
        {user 
        ? <button 
        onClick={handleLogout}
        className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-600">로그아웃</button> 
        : <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">로그인</button>}
      </NavLink>
      </div>
    </nav>
    
  );
};

export default NavBar;
