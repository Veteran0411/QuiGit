import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig';
import { login, logout, setUserFromLocalStorage } from '../redux files/slices/authSlice';


const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setUserFromLocalStorage());
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch(login({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          phoneNumber:user.phoneNumber
        })); // Dispatch login with user info
        if (!user.emailVerified) {
          navigate('/'); // Redirect if email is not verified
        }
      } else {
        // User is signed out
        dispatch(logout());
        navigate('/'); // Redirect to login page
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [dispatch, navigate]);

  return <>{children}</>;
};

export default AuthProvider;