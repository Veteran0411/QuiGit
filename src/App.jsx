import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/login/Login';
import Home from './components/home/Home';
import AuthProvider from './components/common/AuthProvider';
import JoinGame from './components/join game/JoinGame';
import CreateQuestion from './components/create questions/CreateQuestion';


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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
