import React from 'react';
import { useNavigate, NavLink } from 'react-router';

const NavBar = () => {
    
    
  return (
    <nav className="flex justify-between items-center bg-gray-300 p-4">
      <NavLink to="/" className="text-2xl font-semibold text-gray-700">Logo</NavLink>
      <div className="flex space-x-4">
      <NavLink to="/submit" >
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">등록</button>
      </NavLink>
      <NavLink to="/login">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">로그인</button>
      </NavLink>
      </div>
    </nav>
    
  );
};

export default NavBar;
