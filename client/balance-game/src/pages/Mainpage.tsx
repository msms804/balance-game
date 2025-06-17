import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Post {
  postId: number;
  maintitle: string;
  msg1: string;
  msg2: string;
  time: string;   // ISO 날짜 문자열 (서버에서 내려줄 때는 보통 string으로 받음)
  username: string;
}

export const Mainpage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const getCards = async () => {
    const res = await axios.get('http://localhost:5050/api/posts')
    setPosts(res.data.posts);
    console.log(res.data.posts)
  }

  useEffect(() => {
    getCards();
  }, [])
  useEffect(() => {
    if(posts){
    }
  }, [posts])
  return (
    <div className="min-h-screen bg-gray-100">
    {/* 카드 리스트 */}
    <div className="w-full max-w-5xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts && posts.map((post) => (
            <Link to={`/posts/${post.postId}`} key={post.postId}>
              <div className="flex flex-col text-sm bg-gray-300 h-40 rounded shadow-md flex items-center justify-center text-xl font-semibold text-gray-600">
              {/* 카드 {idx + 1} */}
              <div>{post.maintitle}</div>
              <div>{post.msg1}</div>
              <div>vs</div>
              <div>{post.msg2}</div>
              </div>
            </Link>          
          ))}
        </div>
      </div>
    </div>
  )
}
