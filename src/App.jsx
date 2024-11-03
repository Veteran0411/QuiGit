import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login';
import Home from './components/home/Home';
import AuthProvider from './components/common/AuthProvider';
import JoinGame from './components/join game/JoinGame';
import CreateQuestion from './components/create questions/CreateQuestion';
import UserDetails from './components/user details/UserDetails';


function App() {

  return (

    // create routes here and authentication logic
    <>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/joinGame' element={<JoinGame />} />
            <Route path='/createQuestion' element={<CreateQuestion/>} />
            <Route path='/userDetails' element={<UserDetails/>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
