import React from 'react'
import { useParams } from 'react-router-dom'

export const Detail = () => {
  const {id} = useParams();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

    {/* 본문 */}
    <div className="flex-1 p-8 flex flex-col items-center">
      {/* VS 박스 */}
      <div className="flex justify-center items-center gap-8 mb-8">
        <div className="bg-gray-300 w-48 h-48 rounded"></div>
        <div className="text-3xl font-bold">VS</div>
        <div className="bg-gray-300 w-48 h-48 rounded"></div>
      </div>
     {/* 댓글 입력 */}
     <div className="flex w-full max-w-2xl mb-8">
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            className="flex-1 border border-gray-400 p-3 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-blue-500 text-white px-6 rounded-r hover:bg-blue-600">
            등록
          </button>
        </div>
        {/* 댓글 리스트 */}
        <div className="w-full max-w-2xl space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 bg-gray-300 h-6 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

)
}
