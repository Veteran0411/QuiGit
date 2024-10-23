import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Counter from './components/home/Counter';
import Test from './components/home/Test';
import Login from './components/login/Login';
import Modal from './components/modal/Modal';


function App() {

  return (

    // create routes here and authentication logic
    <>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </>
  )
}

export default App
