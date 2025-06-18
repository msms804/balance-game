import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Mainpage } from './pages/Mainpage'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Detail } from './pages/Detail'
import InputFormPage from './pages/InputFormPage'
import NavBar from './components/NavBar'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  //라우터 설정
  return (
    <>
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path='/' element={<Mainpage />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/submit' element={
        <ProtectedRoute>
          <InputFormPage />
        </ProtectedRoute>
      }/>
      <Route path='/post/:postId' element={<Detail />}/>
    </Routes>

    </BrowserRouter>
     
    </>
  )
}

export default App
