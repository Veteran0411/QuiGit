import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";

// MUI imports
import {
    Box,
    Typography,
    CircularProgress,
    Grid,
    Avatar,
    Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Firebase imports
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

// Styled components for custom designs
const StyledAvatar = styled(Avatar)(({ theme }) => ({
    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    color: theme.palette.getContrastText(theme.palette.secondary.main),
    width: theme.spacing(8),
    height: theme.spacing(8),
    fontSize: theme.typography.h5.fontSize,
    fontWeight:700
}));

const AllPlayers = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const gamePin = queryParams.get("gamePin");

    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const [players, setPlayers] = useState([]); // State to hold player data
    const [isLoading, setIsLoading] = useState(true); // Loading state

    useEffect(() => {
        // Ensure the user is set in Redux state
        if (!user) {
            dispatch(setUserFromLocalStorage());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!user) return;

        // Real-time listener for players in the game
        const gamesCollection = collection(firestore, "games");

        const unsubscribe = onSnapshot(gamesCollection, (snapshot) => {
            snapshot.forEach((doc) => {
                const gameData = doc.data();

                // Find the game with the matching gamePin
                for (const [gameId, gameDetails] of Object.entries(gameData)) {
                    if (String(gameDetails.gamePin) === String(gamePin)) {
                        setPlayers(gameDetails.players || []); // Update players list
                        setIsLoading(false); // Stop loading
                        return;
                    }
                }
            });

            setIsLoading(false); // Stop loading if no matching game is found
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, [user, gamePin]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            px={2}
            sx={{
                background: `linear-gradient(135deg, #0f2027, #203a43, #2c5364)`,
                color: "white",
                padding: 4,
            }}
        >
            <Typography
                variant="h4"
                gutterBottom
                sx={{ color: "white", textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}
            >
                All Players
            </Typography>
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "#ffcc80", textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}
            >
                Game Pin: <strong>{gamePin}</strong>
            </Typography>

            {isLoading ? (
                <CircularProgress sx={{ color: "#ffcc80" }} />
            ) : players.length > 0 ? (
                <Box
                    sx={{
                        mt: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Grid container spacing={3} maxWidth={800}>
                        {players.map((player, index) => (
                            <Grid item xs={6} sm={4} md={2.4} key={index}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        backgroundColor: "#e3f2fd",
                                        borderRadius: 2,
                                        padding: 2,
                                        boxShadow: 3,
                                    }}
                                >
                                    <StyledAvatar>
                                        {player.displayName[0].toUpperCase()} {/* First letter of player's name */}
                                    </StyledAvatar>
                                    <Box
                                        sx={{
                                            mt: 1,
                                            maxWidth: "100%",
                                            width: "100%", // Adjust based on container size
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        <Typography
                                            variant="body1"
                                            noWrap
                                            sx={{
                                                fontWeight: "bold",
                                                color: "#3f51b5",
                                                textAlign: "center",
                                            }}
                                        >
                                            {player.displayName}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <Typography variant="body1" sx={{ color: "#ffcc80", mt: 2 }}>
                    No players have joined yet. Waiting for players...
                </Typography>
            )}
        </Box>
    );
};

export default AllPlayers;
