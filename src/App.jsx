import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login';
import Home from './components/home/Home';
import AuthProvider from './components/common/AuthProvider';
import JoinGame from './components/join game/JoinGame';
import CreateQuestion from './components/create questions/CreateQuestion';
import UserDetails from './components/user details/UserDetails';
import Logo from './components/svg/Logo';
import Test from './components/home/Test';
import AllPlayers from './components/all players join/Allplayers';
import DashBoard from './components/dashboard/DashBoard';
import DisplayQuestions from "./components/display questions/DisplayQuestions"


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
            <Route path='/dashboard' element={<DashBoard/>} />
            <Route path='/allPlayers' element={<AllPlayers/>} />
            <Route path='/displayQuestions' element={<DisplayQuestions/>} />

            
            <Route path='/logo' element={<Logo/>} />
            <Route path='/test' element={<Test/>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
