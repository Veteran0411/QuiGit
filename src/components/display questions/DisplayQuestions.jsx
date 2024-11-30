import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box, Typography, Radio, RadioGroup, FormControlLabel, TextField, Button } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../fireBaseConfig";

const DisplayQuestions = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const gamePin = queryParams.get("gamePin");
    const gameCreator = queryParams.get("GCE");
    const user = useSelector((state) => state.auth.user);
    const [isHost, setIsHost] = useState(false); // To track if the user is the host
    const [questions, setQuestions] = useState([]); // Questions array
    const [selectedAnswer, setSelectedAnswer] = useState({}); // Tracks player-selected answers
    const [fillAnswer, setFillAnswer] = useState({}); // Tracks fill-in-the-blank answers

    useEffect(() => {
        if (!user || !gamePin) return;

        const checkIfHost = async () => {
            try {
                const userDocRef = doc(firestore, "games", gameCreator);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();

                    for (const [gameId, gameDetails] of Object.entries(userData)) {
                        if (String(gameDetails.gamePin) === String(gamePin)) {
                            if (gameDetails.createdBy === user.email) {
                                setIsHost(true);
                            }
                            setQuestions([...gameDetails.questions]);
                            break;
                        }
                    }
                }
            } catch (error) {
                console.error("Error checking if the user is the host:", error);
            }
        };

        checkIfHost();
    }, [user, gamePin]);

    const handleMCQSelect = (questionIndex, option) => {
        setSelectedAnswer((prev) => ({ ...prev, [questionIndex]: option }));
        const correctOption = questions[questionIndex]?.correctOptionValue;
        if (option === correctOption) {
            alert("Correct!");
        } else {
            alert("Wrong answer!");
        }
    };

    const handleFillAnswer = (questionIndex) => {
        const correctAnswer = questions[questionIndex]?.correctAnswer.toLowerCase();
        const userAnswer = fillAnswer[questionIndex]?.toLowerCase();
        if (userAnswer === correctAnswer) {
            alert("Correct!");
        } else {
            alert("Wrong answer!");
        }
    };

    if (!questions.length) {
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
            {questions.map((question, index) => (
                <Box key={index} my={3} p={3} sx={{ background: "#1c2833", borderRadius: "8px", width: "100%" }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        {`Q${index + 1}: ${question.question}`}
                    </Typography>

                    {question.type === "mcq" && (
                        <Box>
                            {isHost ? (
                                // Host View: Display options only (no interaction)
                                question.options.map((option, optionIndex) => (
                                    <Typography key={optionIndex} variant="body1" sx={{ color: "white", mb: 1 }}>
                                        {`${optionIndex + 1}. ${option}`}
                                    </Typography>
                                ))
                            ) : (
                                // Player View: Allow option selection
                                <RadioGroup
                                    value={selectedAnswer[index] || ""}
                                    onChange={(e) => handleMCQSelect(index, e.target.value)}
                                >
                                    {question.options.map((option, optionIndex) => (
                                        <FormControlLabel
                                            key={optionIndex}
                                            value={option}
                                            control={<Radio sx={{ color: "white" }} />}
                                            label={option}
                                            sx={{ color: "white" }}
                                        />
                                    ))}
                                </RadioGroup>
                            )}
                        </Box>
                    )}

                    {question.type === "fill-in-the-blank" && (
                        <Box display="flex" flexDirection="column" alignItems="start">
                            {isHost ? (
                                // Host View: Display question only
                                <Typography variant="body1" sx={{ color: "white", mb: 1 }}>
                                    (Answer hidden for players)
                                </Typography>
                            ) : (
                                // Player View: Input and submit answer
                                <>
                                    <TextField
                                        value={fillAnswer[index] || ""}
                                        onChange={(e) => setFillAnswer((prev) => ({ ...prev, [index]: e.target.value }))}
                                        placeholder="Your answer"
                                        variant="outlined"
                                        sx={{
                                            background: "#ffffff",
                                            borderRadius: "8px",
                                            width: "100%",
                                            mb: 2,
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleFillAnswer(index)}
                                    >
                                        Submit Answer
                                    </Button>
                                </>
                            )}
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default DisplayQuestions;
