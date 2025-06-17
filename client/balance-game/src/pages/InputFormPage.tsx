import React, { useEffect, useState } from 'react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface MyJwtPayload extends JwtPayload {
  user_id: number;
  login_id: string;
  username: string;
}

const InputFormPage = () => {
  const [title, setTitle] = useState('');
  const [msg1, setMsg1] = useState('');
  const [msg2, setMsg2] = useState('');
  const [token, setToken] = useState<string | null>();
  const navigate = useNavigate();
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }
  const handleMsg1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg1(e.target.value);
  }
  const handleMsg2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMsg2(e.target.value);
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(title, msg1, msg2);
    try {
      await axios.post('http://localhost:5050/api/post', {
        maintitle: title,
        title1: msg1,
        title2: msg2,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      console.log("게시물 등록 성공");
      navigate('/');
      } catch (error) {
        console.log("게시물 등록 실패")
      }
  }

  useEffect(() => {
    const localStorageToken = localStorage.getItem('token');
    setToken(localStorageToken);
  }, [])

  useEffect(() => {
      if(token){
        const decoded = jwtDecode<MyJwtPayload>(token);
        const userId = decoded.user_id;
        const loginId = decoded.login_id;
        const username = decoded.username;
        console.log(">>", userId, loginId, username);
      }
  }, [token]) 

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* 제목 입력 */}
        <div className="mb-8 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">제목을 입력하세요</h2>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목 입력"
            className="w-full border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* VS 입력 */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <input
            type="text"
            value={msg1}
            onChange={handleMsg1Change}
            placeholder="입력하세요"
            className="w-48 h-32 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="text-2xl font-bold">VS</div>
          <input
            type="text"
            value={msg2}
            onChange={handleMsg2Change}
            placeholder="입력하세요"
            className="w-48 h-32 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 등록 버튼 */}
        <button 
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 transition">
          등록
        </button>
      </div>
    </div>
  );
};

export default InputFormPage;
