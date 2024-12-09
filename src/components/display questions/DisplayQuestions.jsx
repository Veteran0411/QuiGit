import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    CircularProgress,
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    TextField,
    Button,
} from "@mui/material";
import { doc, getDoc, setDoc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { firestore } from "../../fireBaseConfig";
import { toast } from "react-toastify";

const DisplayQuestions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const gamePin = queryParams.get("gamePin");
    const gameCreator = queryParams.get("GCE");
    const user = useSelector((state) => state.auth.user);

    const [isHost, setIsHost] = useState(false); // To track if the user is the host
    const [questions, setQuestions] = useState([]); // Questions array
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Current question index
    const [timer, setTimer] = useState(null); // Timer for the question
    const [playerAnswer, setPlayerAnswer] = useState(""); // Player's answer
    const [isSubmitted, setIsSubmitted] = useState(false); // To track if player has submitted their answer
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (!user || !gamePin) return;

        const gameDocRef = doc(firestore, "games", gameCreator);

        // Fetch game data initially
        const fetchGameData = async () => {
            try {
                const gameDocSnapshot = await getDoc(gameDocRef);
                if (gameDocSnapshot.exists()) {
                    const gameData = gameDocSnapshot.data();

                    for (const [gameId, gameDetails] of Object.entries(gameData)) {
                        if (String(gameDetails.gamePin) === String(gamePin)) {
                            if (gameDetails.createdBy === user.email) {
                                setIsHost(true); // Mark as host if the creator matches
                            }
                            setQuestions([...gameDetails.questions]);
                            setCurrentQuestionIndex(gameDetails.currentQuestion || 0);
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching game data:", error);
            }
        };

        fetchGameData();

        // Listen for real-time updates
        const unsubscribe = onSnapshot(gameDocRef, (docSnapshot) => {
            const gameData = docSnapshot.data();
            if (gameData) {
                for (const [gameId, gameDetails] of Object.entries(gameData)) {
                    if (String(gameDetails.gamePin) === String(gamePin)) {
                        setQuestions([...gameDetails.questions]);
                        setCurrentQuestionIndex(gameDetails.currentQuestion || 0);

                        // Check if the game has ended (no more questions)
                        if (gameDetails.currentQuestion >= gameDetails.questions.length) {
                            toast.success("Game Complete");
                            navigate(`/leaderBoard?gamePin=${gamePin}`);
                        }
                        break;
                    }
                }
            }
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, [user, gamePin, navigate]);
    useEffect(() => {
        // Reset player answer and submission status for each new question
        setIsSubmitted(false);
        setPlayerAnswer("");
    }, [currentQuestionIndex]);


    useEffect(() => {
        if (questions.length === 0) return;

        const currentQuestion = questions[currentQuestionIndex];
        if (!currentQuestion?.timeLimit) return;

        // Set the timer for the current question
        setTimer(currentQuestion.timeLimit);

        const timerInterval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(timerInterval);
                    if (isHost) incrementQuestion(); // Only the host increments the question
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval); // Cleanup the timer on component unmount or question change
    }, [currentQuestionIndex, questions]);

    const incrementQuestion = async () => {
        const gameDocRef = doc(firestore, "games", gameCreator);

        try {
            const gameDocSnapshot = await getDoc(gameDocRef);
            if (gameDocSnapshot.exists()) {
                const gameData = gameDocSnapshot.data();

                for (const [gameId, gameDetails] of Object.entries(gameData)) {
                    if (String(gameDetails.gamePin) === String(gamePin)) {
                        if (currentQuestionIndex < gameDetails.questions.length - 1) {
                            await updateDoc(gameDocRef, {
                                ...gameData,
                                [gameId]: {
                                    ...gameDetails,
                                    currentQuestion: currentQuestionIndex + 1,
                                },
                            });
                        } else {
                            // Navigate both host and players to the leaderboard
                            toast.success("game Complete");
                            navigate(`/leaderBoard?gamePin=${gamePin}`);
                        }
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Error incrementing question:", error);
        }
    };

    const handlePlayerAnswerChange = (e) => {
        setPlayerAnswer(e.target.value);
    };

    const handleSubmitAnswer = async () => {
        const currentQuestion = questions[currentQuestionIndex];
        let isCorrect = false;

        // Check if the answer is correct
        if (currentQuestion.type === "mcq" || currentQuestion.type === "image") {
            if (playerAnswer === currentQuestion.correctOptionValue) {
                isCorrect = true;
            }
        } else if (currentQuestion.type === "fill-in-the-blank") {
            if (playerAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
                isCorrect = true;
            }
        }else if (currentQuestion.type === "true-or-false") {
            if (playerAnswer.toLowerCase() === currentQuestion.correctOptionValue.toLowerCase()) {
                isCorrect = true;
            }
        }

        setIsSubmitted(true); // Disable further submissions

        // Display success or failure message based on correctness
        toast.success("Answer submitted");

        try {
            // Create or update the leaderboard document
            const leaderboardDocRef = doc(firestore, "leaderboard", gamePin); // Assume 'leaderboard' collection tracks scores
            const playerDataPath = `players.${user.email}`; // Path to the player's data using email as the unique ID

            // Ensure points are stored as numbers (default to 0 if not available)
            const points = Number(currentQuestion.points) || 0;

            // Retrieve the current leaderboard data
            const playerDoc = await getDoc(leaderboardDocRef);
            const leaderboardData = playerDoc.exists() ? playerDoc.data() : {};
            const currentPlayerData = leaderboardData.players?.[user.email] || {};

            const currentQuestions = currentPlayerData.questions || {};
            const currentTotalScore = currentPlayerData.totalScore || 0;
            const hasCompleted = currentPlayerData.hasCompleted || false;

            // Do not update scores if the player has already completed the game
            if (hasCompleted) {
                toast.warning("You have already completed the game. Scores cannot be updated.");
                return;
            }

            // Update the questions and total score
            const updatedQuestions = {
                ...currentQuestions,
                [currentQuestion.question]: isCorrect ? points : 0, // Store the question as the key with its points
            };

            const updatedTotalScore = currentTotalScore + (isCorrect ? points : 0); // Increment total score

            // Set or update the player data correctly within the 'players' object
            await setDoc(
                leaderboardDocRef,
                {
                    players: {
                        [user.email]: {
                            questions: updatedQuestions, // Store the question and its score
                            totalScore: updatedTotalScore, // Update the total score
                            displayName: user.displayName || "Anonymous", // Store player's display name
                            hasCompleted: currentQuestionIndex >= questions.length - 1, // Mark the player as completed if it's the last question
                        },
                    },
                },
                { merge: true } // Merge updates into the document
            );
        } catch (error) {
            toast.error("Failed to update score.");
        }

        // If it's the last question, navigate to the dashboard
        if (currentQuestionIndex >= questions.length - 1) {
            toast.success("Game completed");
            navigate("/dashBoard");
        }
    };


    if (questions.length === 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{ background: "#0f2027" }}
            >
                <CircularProgress sx={{ color: "#ffcc80" }} />
            </Box>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

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
                position: "relative",
            }}
        >
            {/* Display timer only for the host */}
            {isHost && (
                <Typography
                    variant="h5"
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "#ffcc80",
                        color: "#000",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontWeight: "bold",
                    }}
                >
                    Time left: {timer}s
                </Typography>
            )}

            {/* Question and options for the host */}
            {isHost && (
                <Typography variant="h2" sx={{ mb: 2 }}>
                    {`Q${currentQuestionIndex + 1}: ${currentQuestion.question}`}
                </Typography>
            )}

            {/* Options for players */}
            {currentQuestion.type === "mcq" && !isHost && (
                <RadioGroup onChange={handlePlayerAnswerChange} value={playerAnswer}>
                    {currentQuestion.options.map((option, index) => (
                        <FormControlLabel
                            key={index}
                            value={option}
                            control={<Radio sx={{ color: "white" }} />}
                            label={option}
                            sx={{ color: "white" }}
                        />
                    ))}
                </RadioGroup>
            )}

            {currentQuestion.type === "true-or-false" && !isHost && (
                <RadioGroup onChange={handlePlayerAnswerChange} value={playerAnswer}>
                    <FormControlLabel
                        value="true"
                        control={<Radio sx={{ color: "white" }} />}
                        label="True"
                        sx={{ color: "white" }}
                    />
                    <FormControlLabel
                        value="false"
                        control={<Radio sx={{ color: "white" }} />}
                        label="False"
                        sx={{ color: "white" }}
                    />
                </RadioGroup>
            )}

            {/* Input field for fill-in-the-blank questions */}
            {currentQuestion.type === "fill-in-the-blank" && !isHost && (
                <TextField
                    placeholder="Your answer"
                    variant="outlined"
                    value={playerAnswer}
                    onChange={handlePlayerAnswerChange}
                    sx={{
                        background: "#ffffff",
                        borderRadius: "8px",
                        width: "100%",
                        mb: 2,
                    }}
                />
            )}

            {/* Submit button for players */}
            {!isHost && !isSubmitted && (
                <Button variant="contained" color="primary" onClick={handleSubmitAnswer}>
                    Submit Answer
                </Button>
            )}

            {/* Host control to move to the next question */}
            {isHost && (
                <Button variant="contained" color="primary" onClick={incrementQuestion}>
                    Next Question
                </Button>
            )}
        </Box>
    );
};

export default DisplayQuestions;
