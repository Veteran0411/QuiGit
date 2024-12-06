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
    TextField,
    InputAdornment,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { startGame, deleteGame } from "../../api/FireStoreApi";
import { firestore } from "../../firebaseConfig";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import SearchIcon from "@mui/icons-material/Search";
import NavigationBar from "../navbar/NavigationBar";

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
    const [usn, setUsn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) {
            dispatch(setUserFromLocalStorage());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (!user?.email) return;

        const fetchUserDetails = async () => {
            try {
                const docRef = doc(firestore, "users", user.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUsn(docSnap.data().usn || "Not Provided");
                } else {
                    console.warn("No such document for user!");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [user?.email]);

    useEffect(() => {
        if (!user?.email) return;

        const docRef = doc(firestore, "games", user.email);

        const unsubscribe = onSnapshot(docRef, (snapshot) => {
            const gameData = snapshot.data();
            if (gameData) {
                setGames(
                    Object.entries(gameData).map(([key, value]) => ({
                        gameId: key,
                        ...value,
                    }))
                );
            } else {
                setGames([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.email]);

    const handleStartGame = async (gamePin, gameId) => {
        try {
            toast.success("Loading game");
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
    const filteredOnlineGames = onlineGames.filter((game) =>
        game.gameName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ backgroundColor: "#11202e", minHeight: "100vh", padding: "1rem" }}>
            <NavigationBar />
            <Grid container spacing={3}>
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
                            <Typography>USN: {usn || "Fetching..."}</Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#f39c12",
                                    color: "#fff",
                                    marginTop: "0.5rem",
                                }}
                                onClick={() => {
                                    navigate("/userDetails");
                                }}
                            >
                                Edit
                            </Button>
                        </Box>
                    </ProfileCard>

                    <LeaderboardCard
                        sx={{
                            marginTop: "1rem",
                            maxHeight: "300px",
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                        }}
                    >
                        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                            Games Hosted
                        </Typography>
                        <TextField
                            placeholder="Search by game name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                            sx={{
                                marginBottom: "1rem",
                                backgroundColor: "#1c2833",
                                borderRadius: "5px",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#34495e",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#f39c12",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#f39c12",
                                    },
                                },
                                input: { color: "#ecf0f1" },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: "#ecf0f1" }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {loading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "150px",
                                }}
                            >
                                <CircularProgress color="inherit" />
                                <Typography sx={{ marginLeft: "1rem" }}>Getting Data...</Typography>
                            </Box>
                        ) : filteredOnlineGames.length > 0 ? (
                            <Grid container spacing={2}>
                                {filteredOnlineGames.map((game, index) => (
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
                                                    onClick={() =>
                                                        navigate(`/leaderBoard?gamePin=${game.gamePin}`)
                                                    }
                                                >
                                                    View Leaderboard
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ backgroundColor: "#16a085", color: "#fff" }}
                                                    onClick={() =>
                                                        navigate(`/seeQuiz?gamePin=${game.gamePin}`)
                                                    }
                                                >
                                                    See Quiz
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
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "150px",
                                }}
                            >
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
                                                    sx={{ backgroundColor: "#27ae60", color: "#fff" }}
                                                    onClick={() =>
                                                        handleStartGame(game.gamePin, game.gameId)
                                                    }
                                                >
                                                    Start Game
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ backgroundColor: "#e74c3c", color: "#fff" }}
                                                    onClick={() =>
                                                        handleDeleteGame(game.gamePin, game.gameId)
                                                    }
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
