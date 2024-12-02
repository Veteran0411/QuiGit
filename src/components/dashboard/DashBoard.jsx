import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    Box,
    Button,
    Grid,
    Typography,
    styled,
    CircularProgress,
    Card,
    CardContent,
    CardActions,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { startGame, deleteGame } from "../../api/FireStoreApi";
import { firestore } from "../../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const ProfileCard = styled(Box)(({ theme }) => ({
    backgroundColor: "#22303c",
    color: "white",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: theme.shadows[2],
}));

const LeaderboardCard = styled(Box)(({ theme }) => ({
    backgroundColor: "#22303c",
    color: "white",
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: theme.shadows[2],
    overflow: "hidden",
}));

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            dispatch(setUserFromLocalStorage());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!user?.email) return;

        const docRef = doc(firestore, "games", user.email);

        // Real-time listener for games
        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            const gameData = snapshot.data();
            if (gameData) {
                setGames(Object.entries(gameData).map(([key, value]) => ({ gameId: key, ...value })));
            } else {
                setGames([]);
            }
            setLoading(false);
        });

        return () => unsubscribe(); // Clean up the listener on component unmount
    }, [user?.email]);

    const handleStartGame = async (gamePin, gameId) => {
        try {
            toast.success("Loading game")
            const res = await startGame(user.email, gamePin, gameId);
            if (res.success) {
                navigate(`/allPlayers?gamePin=${gamePin}`);
            } else {
                toast.error("Server is busy. Please try again later.");
            }
        } catch (e) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const handleDeleteGame = async (gamePin, gameId) => {
        try {
            const res = await deleteGame(user.email, gamePin, gameId);

            if (res.success) {
                toast.success(`${res.message}`);
            } else {
                toast.error(`${res.message}`);
            }
        } catch (e) {
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const onlineGames = games.filter((game) => game.isOnline);
    const pendingGames = games.filter((game) => !game.isOnline);

    return (
        <Box sx={{ backgroundColor: "#11202e", minHeight: "100vh", padding: "1rem" }}>
            <Grid container spacing={3}>
                {/* Profile Section */}
                <Grid item xs={12} md={4}>
                    <ProfileCard>
                        <Typography variant="h6">Profile</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "0.5rem",
                                marginTop: "1rem",
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "#506680",
                                    height: "80px",
                                    width: "80px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "2rem",
                                    fontWeight: "bold",
                                    color: "white",
                                }}
                            >
                                {user?.displayName?.charAt(0).toUpperCase() || "P"}
                            </Box>
                            <Typography>Name: {user?.displayName || "Unknown"}</Typography>
                            <Typography>Email: {user?.email || "Unknown"}</Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#f39c12",
                                    color: "#fff",
                                    marginTop: "0.5rem",
                                }}
                                onClick={() => { navigate("/userDetails") }}
                            >
                                Edit
                            </Button>
                        </Box>
                    </ProfileCard>

                    {/* Games Online Section */}
                    <LeaderboardCard sx={{ marginTop: "1rem" }}>
                        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                            Games Completed
                        </Typography>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                                <CircularProgress color="inherit" />
                                <Typography sx={{ marginLeft: "1rem" }}>Getting Data...</Typography>
                            </Box>
                        ) : onlineGames.length > 0 ? (
                            <Grid container spacing={2}>
                                {onlineGames.map((game, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Card
                                            sx={{
                                                backgroundColor: "#2c3e50",
                                                color: "white",
                                                borderRadius: "10px",
                                                boxShadow: 2,
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {game.gameName}
                                                </Typography>
                                                <Typography>Game PIN: {game.gamePin}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ backgroundColor: "#3498db", color: "#fff" }}
                                                    onClick={() => navigate(`/leaderBoard?gamePin=${game.gamePin}`)}
                                                >
                                                    View Leaderboard
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography>No online games found.</Typography>
                        )}
                    </LeaderboardCard>

                </Grid>

                {/* Games Pending Section */}
                <Grid item xs={12} md={8}>
                    <LeaderboardCard>
                        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                            Games Pending
                        </Typography>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                                <CircularProgress color="inherit" />
                                <Typography sx={{ marginLeft: "1rem" }}>Getting Data...</Typography>
                            </Box>
                        ) : pendingGames.length > 0 ? (
                            <Grid container spacing={2}>
                                {pendingGames.map((game, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Card
                                            sx={{
                                                backgroundColor: "#2c3e50",
                                                color: "white",
                                                borderRadius: "10px",
                                                boxShadow: 2,
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {game.gameName}
                                                </Typography>
                                                <Typography>Game PIN: {game.gamePin}</Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    onClick={() => handleStartGame(game.gamePin, game.gameId)}
                                                    sx={{ backgroundColor: "#f39c12" }}
                                                >
                                                    Start Game
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleDeleteGame(game.gamePin, game.gameId)}
                                                    sx={{ color: "#e74c3c", borderColor: "#e74c3c" }}
                                                >
                                                    Delete Game
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography>No pending games found.</Typography>
                        )}
                    </LeaderboardCard>
                </Grid>
            </Grid>
        </Box>
    );

};

export default Dashboard;
