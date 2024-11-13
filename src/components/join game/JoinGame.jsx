import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SignOutApi } from "../../api/AuthApi";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";

// mui imports
import { Box, Button, TextField, Typography } from "@mui/material";

const JoinGame = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const [gamePin, setGamePin] = useState("");

  // add logic to check is not authenticated then traverse back to home page
  useEffect(() => {
    dispatch(setUserFromLocalStorage());
  }, [dispatch]);

  const handleInputChange = (event) => {
    setGamePin(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle the game pin submission
    console.log(`Game pin submitted: ${gamePin}`);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Join Game
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter game pin"
          variant="outlined"
          value={gamePin}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
      <div onClick={() => SignOutApi()}>Signout</div>
    </Box>
  );
};

export default JoinGame;
