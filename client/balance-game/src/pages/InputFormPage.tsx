import React from 'react';

const InputFormPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* 제목 입력 */}
        <div className="mb-8 w-full max-w-md text-center">
          <h2 className="text-xl font-semibold mb-4">제목을 입력하세요</h2>
          <input
            type="text"
            placeholder="제목 입력"
            className="w-full border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* VS 입력 */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <input
            type="text"
            placeholder="입력하세요"
            className="w-48 h-32 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="text-2xl font-bold">VS</div>
          <input
            type="text"
            placeholder="입력하세요"
            className="w-48 h-32 border border-gray-400 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 등록 버튼 */}
        <button className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 transition">
          등록
        </button>
      </div>
    </div>
  );
};

export default InputFormPage;
