import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Counter from './components/home/Counter';
import Test from './components/home/Test';
import Login from './components/login/Login';
import Modal from './components/modal/Modal';
import { login, logout } from './components/redux files/slices/authSlice';
import Home from './components/home/Home';
import AuthProvider from './components/common/AuthProvider';


function App() {

  return (

    // create routes here and authentication logic
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Home />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
