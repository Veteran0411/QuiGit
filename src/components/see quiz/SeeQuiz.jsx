import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { CircularProgress, Box, Typography, Card, CardContent } from "@mui/material";

const SeeQuiz = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [quizData, setQuizData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const gamePin = new URLSearchParams(location.search).get("gamePin");

    useEffect(() => {
        if (!user) {
            dispatch(setUserFromLocalStorage());
        }
    }, [dispatch, user]);

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!user || !user.email) {
                console.error("User is not defined or email is missing.");
                setIsLoading(false);
                return;
            }

            try {
                const docRef = doc(firestore, "games", user.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const gameData = docSnap.data();

                    // Find the game with the matching gamePin
                    for (const [gameId, gameDetails] of Object.entries(gameData)) {
                        if (String(gameDetails.gamePin) === String(gamePin)) {
                            const questions = gameDetails.questions || [];
                            setQuizData(questions);
                            break;
                        }
                    }
                } else {
                    console.error("No game data found for the user.");
                }
            } catch (error) {
                console.error("Error fetching quiz data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizData();
    }, [gamePin, user]);

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
                <Typography sx={{ marginLeft: "1rem" }}>Loading quiz data...</Typography>
            </Box>
        );
    }

    if (!user) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <Typography>Please log in to view this quiz.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: "#11202e", minHeight: "100vh", padding: "2rem" }}>
            <Typography variant="h4" sx={{ color: "white", marginBottom: "2rem" }}>
                Quiz Questions and Answers
            </Typography>
            {quizData.length > 0 ? (
                quizData.map((question, index) => {
                    const correctAnswer =
                        question.type === "mcq" || question.type === "image"
                            ? question.correctOptionValue
                            : question.type === "fill-in-the-blank"
                            ? question.correctAnswer
                            : "Not specified";

                    return (
                        <Card
                            key={index}
                            sx={{
                                backgroundColor: "#2c3e50",
                                color: "white",
                                marginBottom: "1rem",
                                padding: "1rem",
                                borderRadius: "10px",
                                boxShadow: 2,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6">{`Question ${index + 1}: ${question.question}`}</Typography>
                                <Typography>{`Correct Answer: ${correctAnswer}`}</Typography>
                                <Typography>{`Points: ${question.points}`}</Typography>
                            </CardContent>
                        </Card>
                    );
                })
            ) : (
                <Typography>No Data Found</Typography>
            )}
        </Box>
    );
};

export default SeeQuiz;
