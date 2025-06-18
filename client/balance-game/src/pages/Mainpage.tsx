import axios from 'axios'
import { useEffect, useState } from 'react'
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
  const apiUrl = import.meta.env.VITE_API_URL;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // 카드 리스트 가져오는 함수
  const getCards = async () => {
    const res = await axios.get(`${apiUrl}/api/posts`)
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
    <div className="w-full max-w-5xl mx-auto p-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts && posts.map((post) => (
            <Link 
            to={`/post/${post.postId}`} 
            onClick={(e) => {
              if(isNavigating) e.preventDefault();
              setIsNavigating(true);
            }}
            key={post.postId}>
            <div className="flex flex-col justify-between bg-green-400 w-60 h-80 rounded shadow-md p-4 text-black">
              
              {/* 메인 타이틀 맨 위 */}
              <div className="text-2xl font-extrabold mb-4">
                {post.maintitle}
              </div>
          
              {/* 선택지 영역 - 가운데 정렬 */}
              <div className="flex flex-col items-center justify-center gap-2 flex-1">
                <div className="text-xl font-semibold">{post.msg1}</div>
                <div className="text-lg font-bold">VS</div>
                <div className="text-xl font-semibold">{post.msg2}</div>
              </div>
          
            </div>
          </Link>
             
          ))}
        </div>
      </div>
    </div>
  )
}
