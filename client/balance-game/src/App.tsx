import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Mainpage } from './pages/Mainpage'
import { Signup } from './pages/Signup'
import { Login } from './pages/Login'
import { Detail } from './pages/Detail'
import InputFormPage from './pages/InputFormPage'
import NavBar from './components/NavBar'
function App() {
  return (
    <>
    <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path='/' element={<Mainpage />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/submit' element={<InputFormPage />}/>
      <Route path='/detail/:id' element={<Detail />}/>
    </Routes>
    </BrowserRouter>
     
    </>
  )
}

export default App
