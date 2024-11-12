import { onAuthStateChanged } from 'firebase/auth';
import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { Button, Box, Typography,Grid } from '@mui/material';
import pcImg from"../../assets/pc.png";

// firestore.jsx imports
import { createUserCollection } from '../../api/FireStoreApi';

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
  }, [dispatch,user]);

  const handleCreate = async() => {
    const status=await createUserCollection(user.email,user.displayName);
    if(status){
      navigate("/createQuestion");
    }
  };

  const handleJoin = async() => {
    const status=await createUserCollection(user.email,user.displayName);
    if(status){
      navigate("/joinGame")
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', // Gradient background
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      }}
    >
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {/* Left Section: Text and Buttons */}
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Welcome to QuiGit!
            {/* {user.displayName} */}
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 500, mb: 3, mx: 'auto' }}>
          Get ready to play, learn, and enjoy! Test your skills with engaging quizzes and challenge your friends as you embark on an exciting journey of knowledge.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center', // Center-aligns buttons
            }}
          >
            <Button
              variant="contained"
              onClick={handleCreate}
              sx={{
                backgroundColor: '#00bcd4',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#0097a7',
                },
              }}
            >
              Create
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleJoin}
              sx={{
                backgroundColor: '#1f4068',
                color: 'white',
                fontWeight: 'bold',
                padding: '10px 20px',
                '&:hover': {
                  backgroundColor: '#1a355b',
                },
              }}
            >
              Join Now
            </Button>
          </Box>
        </Grid>

        {/* Right Section: Image */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={pcImg} // Replace with your actual image URL
            alt="Illustration"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: '8px',
              // check between black and white
              filter: 'drop-shadow(5px 5px 10px rgba(255, 255, 255, 0.1))', // Adds subtle shadow to the image
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default CreateOrJoin