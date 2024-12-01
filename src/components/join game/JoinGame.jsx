import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SignOutApi } from "../../api/AuthApi";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";

import { toast } from "react-toastify";

// MUI imports
import {
    Box,
    Button,
    TextField,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { joinGame } from "../../api/FireStoreApi";

// Animation for the card
const fadeInUp = keyframes`
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
`;

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
            const res = await joinGame(user.email, gamePin, user.displayName);
            if (res.status) {
                toast.success(`${res.message}`);
                navigate(`/allPlayers?gamePin=${gamePin}`);
            } else {
                toast.warn(`${res.message}`);
            }
        } catch (e) {
            console.error("Error while joining game:", e);
            toast.error(`${res.message}`);
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
                sx={{ background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}
            >
                <CircularProgress sx={{ color: "#ffcc80" }} />
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
            sx={{
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                padding: 4,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #2c5364, #0f2027)",
                    color: "white",
                    width: "100%",
                    maxWidth: 400,
                    animation: `${fadeInUp} 1s ease-out`,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
                }}
            >
                {user ? (
                    <>
                        <Typography
                            variant="h4"
                            gutterBottom
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                marginBottom: 2,
                                color: "#ffcc80",
                                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            Welcome, {user.displayName}!
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                marginBottom: 3,
                                color: "#e0e0e0",
                                fontStyle: "italic",
                            }}
                        >
                            Enter the game pin below to join
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Game Pin"
                                variant="outlined"
                                value={gamePin}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                sx={{
                                    background: "#ffffff",
                                    borderRadius: "8px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    marginTop: 2,
                                    background: "#ffcc80",
                                    color: "#000",
                                    "&:hover": {
                                        background: "#ffe0b2",
                                    },
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Join Game
                            </Button>
                        </form>
                        <Button
                            onClick={() => SignOutApi()}
                            color="secondary"
                            fullWidth
                            sx={{
                                marginTop: 2,
                                color: "#ffcc80",
                                "&:hover": {
                                    color: "#ffe0b2",
                                },
                            }}
                        >
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <Typography variant="h6" color="error" textAlign="center">
                        User not authenticated. Please log in.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default JoinGame;
