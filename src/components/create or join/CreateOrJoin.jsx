import { onAuthStateChanged } from 'firebase/auth';
import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { Button, Box, Typography } from '@mui/material';

// if u want then use auth to get user data
// import { auth } from '../../firebaseConfig';

const CreateOrJoin = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate=useNavigate();

  useEffect(() => {
    // onAuthStateChanged(auth,res=>{console.log(res)})
    if(!user){
      dispatch(setUserFromLocalStorage());
    }
    console.log("inside user details",user);
  }, [dispatch,user]);

  const handleCreate = () => {
    console.log("Create button clicked");
    // Navigate to create game screen or trigger create game logic
  };

  const handleJoin = () => {
    console.log("Join button clicked");
    navigate("/joinGame")
    // Navigate to join game screen or trigger join game logic
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Choose an Option
      </Typography>
      <Box 
        sx={{
          display: 'flex',
          gap: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create
        </Button>
        <Button variant="contained" color="secondary" onClick={handleJoin}>
          Join
        </Button>
      </Box>
    </Box>
  )
}

export default CreateOrJoin