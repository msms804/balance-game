import React from 'react'
import { Link } from 'react-router-dom'

export const Mainpage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
    {/* 카드 리스트 */}
    <div className="w-full max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, idx) => (
            <Link to={`/detail/${idx}`} key={idx}>
              <div className="bg-gray-300 h-40 rounded shadow-md flex items-center justify-center text-xl font-semibold text-gray-600">
              카드 {idx + 1}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
