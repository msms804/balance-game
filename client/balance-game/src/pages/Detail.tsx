import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useToken } from '../hooks/useToken';

interface PostDetail {
  postId: number;
  maintitle: string;
  msg1: string;
  msg2: string;
  username: string;
  time: string;  // ISO date string
  votes: {
    msg1: number;
    msg2: number;
  }
}
interface CommentType {
  commentId: number;
  userId: number;
  userName: string;
  comment: string;
  time: string;
}

export const Detail = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {postId} = useParams();
  const [post, setPost] = useState<PostDetail>();
  const [selected, setSelected] = useState<'msg1' | 'msg2' | null>(null);
  const user = useAuth();
  const token = useToken();
  const [comment, setComment] = useState<string>('');
  const [commentList, setCommentList] = useState<CommentType[]>([]);
  
  const [hasVoted, setHasVoted] = useState(false);
  const [voteResult, setVoteResult] = useState<{msg1: number; msg2: number}>({msg1: 0, msg2: 0});

  /* 상세페이지 가져오는 로직 */
  useEffect(() => {
    getDetailPage();
    getCommentList();

    if(user){
      checkVoted();  
    }
  } , [user])
  
  
  /* 댓글 리스트 가져오는 로직 */
    const getCommentList = async () => {
      const res = await axios.get(`${apiUrl}/api/comments/${postId}`)
      setCommentList(res.data.posts);
    }


  const getDetailPage = async () => {
    const res = await axios.get(`${apiUrl}/api/post/${postId}`)
    setPost(res.data)
  }
  

    /* 댓글 등록 로직 */
   const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          setComment(e.target.value);
   }
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await axios.post(`${apiUrl}/api/comment`, {
        post_id: post?.postId,
        comment: comment,
    }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setComment('');
      await getCommentList();
    } catch (error) {
      console.log("댓글 등록 실패")
    }
    
  }
  /* 투표 기능 */
  const handleVote = async (choice: 'msg1' | 'msg2') => {
    setSelected(choice);
    try {
      await axios.post(`${apiUrl}/api/vote`, {
        post_id: post?.postId,
        choice: choice, //여기서 selected를 넣으면 늦게 렌더링됨(늦게 반영)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      await checkVoted();
      await getDetailPage(); // 이거까지 추가해야
    } catch (error) {
      console.log("투표 실패..", error);
    }
  }

  const checkVoted = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/vote/${postId}/${user?.user_id}`);
      
      if (res.data.voted) {
        setHasVoted(true);
        setVoteResult(res.data.votes);
        setSelected(res.data.choice); // 내가 고른 선택지
      }
    } catch (err) {
      console.log("투표여부 확인 실패");
    }
  }
  /* 삭제 기능 구현 */
  const handleDelete = async (commentId: number) => {
    try {
      await axios.delete(`${apiUrl}/api/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log("삭제 완료");
      await getCommentList();
    } catch (error) {
      console.log("댓글 삭제 실패", error);
    }
  }

  if(!post) return <div>불러오는중...</div>;

  return (
    <div className="min-h-screen bg-gray-100 items-center flex flex-col">
      <div className="mt-4 bg-green-400 rounded-3xl w-[300px] h-[400px] flex flex-col justify-between p-6 shadow-lg">
    
    {/* 메인 타이틀 */}
    <div className="text-4xl font-extrabold text-black mb-4">
      {post?.maintitle}
    </div>

    {/* 선택지 */}
    <div className="flex flex-col items-center justify-center gap-4 flex-1">
      <div
        className={`flex flex-col items-center text-2xl font-semibold
          ${hasVoted ? 'pointer-events-none opacity-70' : ''}
          `}
        onClick={() => handleVote("msg1")}
      >
        {post?.msg1}
        {/* hasVoted일 때 투표수 표시 */}
        {hasVoted && (
          <div className='text-sm text-red-600 mt-1'>
            {post?.votes.msg1}표
          </div>
        )}
      </div>

      <div className="text-xl font-bold">VS</div>

      <div
        className={`flex flex-col items-center text-2xl font-semibold 
          ${hasVoted ? 'pointer-events-none opacity-70' : ''}
          `}
        
        onClick={() => handleVote("msg2")}
      >
        {post?.msg2}
        {/* hasVoted일 때 투표수 표시 */}
        {hasVoted && (
          <div className='text-sm text-red-600 mt-1'>
            {post?.votes.msg2}표
          </div>
        )}
      </div>
    </div>

    {/* 하단 제작자 표시
    <div className="text-sm text-blue-800 text-right">
      언밸런스
    </div> */}
  </div>
    <div className="flex-1 p-8 flex flex-col w-[600px] items-center">
             {/* 댓글 입력 */}
             <div className="flex w-full max-w-2xl mb-8">
          <input
            type="text"
            value={comment}
            onChange={handleCommentChange}
            placeholder="댓글을 입력하세요"
            className="flex-1 border border-gray-400 p-3 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button 
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 rounded-r hover:bg-blue-600">
            등록
          </button>
        </div>
        {/* 댓글 리스트 */}
        <div className="w-full max-w-2xl space-y-4">
  {commentList.map((item, idx) => (
    <div key={idx} className="flex items-start space-x-4">
      {/* 아바타 */}
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
        
      </div>

      {/* 닉네임 + 댓글 */}
      <div className='flex flex-row items-center w-full justify-between'>
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-gray-700 mb-1">{item.userName}</div>
        <div className="text-sm text-gray-600">{item.comment}</div>
      </div>
        {/* 조건부 삭제 버튼 */}
        {item.userId === user?.user_id && (
          <div 
          onClick={() => handleDelete(item.commentId)}
          className="text-xs text-red-500 mt-1 hover:underline"
          >
            삭제
          </div>
        )}
      
      </div>
      
    </div>
  ))}
</div>

      </div>
    </div>
)}
