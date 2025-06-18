import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { queryClient } from '../query/queryClient';
export const Login = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [id, setID] = useState('');
  const [pw, setPW] = useState('');
  const [errmsg, setErrmsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const toSignUp = () => {
    navigate('/signup')
  }
  const handleIDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setID(e.target.value);
  }
  const handlePWChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPW(e.target.value);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/api/login`, {
        login_id: id, 
        password: pw,
      })
      const token = response.data.token;
      localStorage.setItem('token', token);
      await queryClient.invalidateQueries({queryKey : ['me']});
      navigate('/')
    } catch (error) {
      setID('')
      setPW('')
      setErrmsg("다시 입력해주세요.")
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
              onChange={handleIDChange}
              value={id}
              placeholder="아이디 입력하세요"
              className="w-full border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">PASSWORD</label>
            <input
              type="password"
              onChange={handlePWChange}
              value={pw}
              placeholder="비밀번호 입력하세요"
              className="w-full border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>


          {/* 로그인 버튼 */}
          <button 
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition">
            로그인
          </button>
          <div className='text-xs text-red-400 mt-2'>회원이 아니신가요?<span className='underline cursor-pointer' onClick={toSignUp}>회원가입 하러가기</span></div>
          {errmsg && <div className='text-xs text-red-400 mt-2'>{errmsg}</div>}
        </form>
      </div>
    </div>
  )
}
