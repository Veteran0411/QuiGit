import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, setUserFromLocalStorage } from '../redux files/slices/authSlice';
import { updateUserProfile } from "../../api/AuthApi";
import { useNavigate } from 'react-router-dom';
import { createUserCollection } from '../../api/FireStoreApi';
// mui imports
import { TextField, Button, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [displayName, setDisplayName] = useState("");
  const [usn, setUsn] = useState(""); // State for USN
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      dispatch(setUserFromLocalStorage());
    }
    console.log("inside user details", user);
  }, [dispatch]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Ensure USN is provided before proceeding
      if (!usn || !displayName) {
        console.error("Display Name and USN are required!");
        return;
      }

      // Create or update Firestore document
      const status=await createUserCollection(user.email, displayName, usn);
      if(status){
        toast.success("Profile Updated");
      }
      else{
        toast.warn("Error Occurred");
      }
      const res = await updateUserProfile(displayName);
      if (res === "success") {
        dispatch(updateUser({ displayName, usn })); // Dispatch to update Redux store with both fields

        // Step 2: Navigate back to home
        navigate("/home");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.log("in userDetails", error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          padding: '2rem',
          borderRadius: '15px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.01)',
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#00e5ff' }}>
          Update Your Profile
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.8 }}>
          Enter a new display name and USN to update your profile.
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
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&:hover fieldset': { borderColor: '#00e5ff' },
                '&.Mui-focused fieldset': { borderColor: '#00e5ff' },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
            }}
            required
          />
          <TextField
            label="USN"
            variant="outlined"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
            placeholder="Enter your USN"
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&:hover fieldset': { borderColor: '#00e5ff' },
                '&.Mui-focused fieldset': { borderColor: '#00e5ff' },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'white',
              },
            }}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundImage: 'linear-gradient(to right, #00c6ff, #0072ff)',
              color: 'white',
              fontWeight: 'bold',
              padding: '10px 20px',
              borderRadius: '25px',
              boxShadow: '0px 4px 15px rgba(0, 114, 255, 0.4)',
              transition: 'background 0.3s, transform 0.2s',
              '&:hover': {
                backgroundImage: 'linear-gradient(to right, #0072ff, #00c6ff)',
                transform: 'scale(1.02)',
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
