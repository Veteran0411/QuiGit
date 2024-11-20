// UserDetails.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, setUserFromLocalStorage } from '../redux files/slices/authSlice';
import { updateUserProfile } from "../../api/AuthApi";
import { useNavigate } from 'react-router-dom';
// import { updateUser } from '../store/actions'; // Add your action to update user details in Redux


// mui imports
import { TextField, Button, Box, Typography } from '@mui/material';

const UserDetails = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("8310306752");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      dispatch(setUserFromLocalStorage());
    }
    console.log("inside user details", user);
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateUserProfile(displayName);
    if (res === "success") {
      dispatch(updateUser({ displayName }));  // Dispatch to update Redux store

      // Step 2: Navigate back to home
      navigate("/home");
    } else {
      console.error("Failed to update profile");
    }
    navigate("/home");
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width:'100vw',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slightly more transparent for a sleeker look
          padding: '2rem',
          borderRadius: '15px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.5)', // Stronger shadow for more depth
          backdropFilter: 'blur(10px)', // Adds a blur effect for a glassy look
          transition: 'transform 0.3s ease-in-out', // Smooth animation on hover
          '&:hover': {
            transform: 'scale(1.01)', // Slightly enlarges the card on hover
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#00e5ff' }}>
          Update Your Display Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
          Enter a new display name to update your profile.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Display Name"
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              input: {
                color: 'white',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#00e5ff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00e5ff',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)', // Initial label color
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white', // Label color when focused
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundImage: 'linear-gradient(to right, #00c6ff, #0072ff)', // Gradient button
              color: 'white',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '25px', // Rounded button
              boxShadow: '0px 4px 15px rgba(0, 114, 255, 0.4)', // Glowing shadow effect
              transition: 'background 0.3s, transform 0.2s', // Smooth transition on hover
              '&:hover': {
                backgroundImage: 'linear-gradient(to right, #0072ff, #00c6ff)',
                transform: 'scale(1.02)', // Slightly enlarges on hover
              },
            }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default UserDetails;
