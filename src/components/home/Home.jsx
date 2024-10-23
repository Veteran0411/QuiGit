import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { SignOutApi } from '../../api/AuthApi';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { setUserFromLocalStorage } from '../redux files/slices/authSlice';

const Home = () => {
    const dispatch=useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    // add logic to check is not authenticated then traverse back to home page
    useEffect(() => {
      dispatch(setUserFromLocalStorage());
  }, [dispatch])

  return (<>
    <div>Home
    <p> {isAuthenticated?"true":"false"}</p>

    {/* display name is null */}
    {user?.email} 
    {console.log(user,"user")}
    </div>
    <div onClick={()=>SignOutApi()}>signout</div>
    </>
  )
}

export default Home