import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SignOutApi } from "../../api/AuthApi";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";

import { toast } from "react-toastify";

// MUI imports
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { joinGame } from "../../api/FireStoreApi";

const JoinGame = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [gamePin, setGamePin] = useState("");
    const [isLoading, setIsLoading] = useState(true); // Track loading state

    // Load user from local storage if not available in Redux
    useEffect(() => {
        if (!user) {
            dispatch(setUserFromLocalStorage());
        } else {
            setIsLoading(false); // Stop loading once user is available
        }
    }, [dispatch, user]);

    const handleInputChange = (event) => {
        setGamePin(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) {
            toast.error("User is not authenticated. Please log in.");
            return;
        }
        try {
            const res = await joinGame(user.email, gamePin,user.displayName);
            if (res) {
                toast.success("Joined Game.");
                navigate(`/allPlayers?gamePin=${gamePin}`);
            } else {
                toast.dark("Game is not live yet/ pin does not exist");
            }
        } catch (e) {
            console.error("Error while joining game:", e);
            toast.error("Failed to join game. Please try again.");
        }
    };

    if (isLoading) {
        // Display a loader while fetching user data
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            {user ? (
                <>
                    <Typography variant="h4" gutterBottom>
                        Join Game
                        {user.displayName}
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
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                        >
                            Submit
                        </Button>
                    </form>
                    <Button onClick={() => SignOutApi()} color="secondary">
                        Sign Out
                    </Button>
                </>
            ) : (
                <Typography variant="h6" color="error">
                    User not authenticated. Please log in.
                </Typography>
            )}
        </Box>
    );
};

export default JoinGame;
