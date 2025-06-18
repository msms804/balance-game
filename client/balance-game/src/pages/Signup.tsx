import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const Signup = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [checkPW, setCheckPW] = useState('');
  const navigate = useNavigate();
  const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  }
  const handlePWChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
  }
  const handlePWCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckPW(e.target.value);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/signup`, {
          login_id : id, 
          password : pw,
          username: '테스트',
        });
      console.log("회원가입 성공");
      navigate('/login');
    } catch (error) {
      console.log("회원가입 실패", error);
    }

  }
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
     

      {/* 폼 컨테이너 */}
      <div className="flex justify-center items-center flex-1">
        <form className="bg-white p-8 rounded shadow-md w-full max-w-md">
          {/* ID */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">ID</label>
            <input
              type="text"
              value={id}
              onChange={handleIDChange}
              placeholder="아이디 입력하세요"
              className="w-full border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">PASSWORD</label>
            <input
              type="password"
              value={pw}
              onChange={handlePWChange}
              placeholder="비밀번호 입력하세요"
              className="w-full border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* PW 확인 */}
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">PW 확인</label>
            <input
              type="password"
              value={checkPW}
              onChange={handlePWCheckChange}
              placeholder="비밀번호 다시 입력하세요"
              className="w-full border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* 회원가입 버튼 */}
          <button 
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition">
            회원가입
          </button>
        </form>
      </div>
    </div>
  )
}
