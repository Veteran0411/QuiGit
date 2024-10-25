// UserDetails.js
import React, { useState,useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { updateUser, setUserFromLocalStorage } from '../redux files/slices/authSlice';
import {updateUserProfile} from "../../api/AuthApi";
import { useNavigate } from 'react-router-dom';
// import { updateUser } from '../store/actions'; // Add your action to update user details in Redux


// mui imports
import { TextField, Button, Box, Typography } from '@mui/material';

const UserDetails = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [displayName,setDisplayName]=useState("");
  const [phoneNumber,setPhoneNumber]=useState("8310306752");
  const navigate=useNavigate();

  useEffect(() => {
    if(!user){
      dispatch(setUserFromLocalStorage());
    }
    console.log("inside user details",user);
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res=await updateUserProfile(displayName);
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      <Typography variant="h5" gutterBottom>
        Update Your Display Name
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Display Name"
          variant="outlined"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
          sx={{ mb: 2, width: '100%' }}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default UserDetails;
