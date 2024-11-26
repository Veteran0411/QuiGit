import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";
import { useNavigate } from 'react-router-dom';

import Loader from "../common/Loader"
// Game PIN generator function
import { generateGamePin } from './game pin generator/gamePinGenerator';

// MUI Components
import {
    Box,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
} from "@mui/material";

import { createGameCollection } from "../../api/FireStoreApi";

const CreateQuestion = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [gamePin, setGamePin] = useState("");
    const [gameName, setGameName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    // navigate variables

    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setUserFromLocalStorage());
        const savedQuestions = JSON.parse(localStorage.getItem("questions"));
        if (savedQuestions) {
            setQuestions(savedQuestions);
        }
        getGamePin();
    }, [dispatch]);

    const getGamePin = () => {
        const pin = generateGamePin();
        setGamePin(pin);
    };

    const addQuestion = () => {
        const newQuestions = [...questions];
        newQuestions.push({
            question: "",
            type: "mcq",
            options: ["", "", "", ""],
            correctOptionIndex: null,
            correctOptionValue: "",
            correctAnswer: "",
            imagePreview: null,
            timeLimit: 0,
            points: 0
        });
        setQuestions(newQuestions);
        setCurrentQuestionIndex(newQuestions.length - 1);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };

    const navigateToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const deleteQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
        if (index <= currentQuestionIndex) {
            setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        }
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(newQuestions);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };

    const handleCorrectOptionChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correctOptionIndex = optionIndex;
        newQuestions[questionIndex].correctOptionValue =
            newQuestions[questionIndex].options[optionIndex];
        setQuestions(newQuestions);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };

    const handleTypeChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].type = value;
        if (value === "image") {
            newQuestions[index].imagePreview = null;
        }
        setQuestions(newQuestions);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };

    const handleImageUpload = (index, file) => {
        const newQuestions = [...questions];
        const reader = new FileReader();
        reader.onload = (e) => {
            newQuestions[index].imagePreview = e.target.result;
            setQuestions(newQuestions);
            localStorage.setItem("questions", JSON.stringify(newQuestions));
        };
        reader.readAsDataURL(file);
    };

    const handleCorrectAnswerChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].correctAnswer = value;
        setQuestions(newQuestions);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };

    const handleFieldChange = (questionIndex, fieldName, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex][fieldName] = value;
        setQuestions(newQuestions);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!gameName.trim()) {
            alert("Please enter a name for the game.");
            return;
        }
        if (questions.length === 0) {
            alert("Please add at least one question before submitting.");
            return;
        }
        if (
            questions.some(
                (q) =>
                    !q.question ||
                    (q.type === "mcq" && q.correctOptionIndex === null) ||
                    (q.type === "mcq" && q.options.some((option) => !option)) ||
                    (q.type === "image" && (!q.imagePreview || q.correctOptionIndex === null)) ||
                    (q.type === "fill-in-the-blank" && !q.correctAnswer) ||
                    !q.timeLimit ||
                    !q.points
            )
        ) {
            alert("Please complete all fields before submitting.");
            return;
        }

        const submittedData = {
            gameName,
            gamePin: gamePin || "No Game Pin Set",
            questions,
        };

        setLoading(true); // Show loader
        try {
            const res = await createGameCollection(user.email, submittedData);
            if (res) {

                localStorage.removeItem("questions");

                // Reset local state if necessary
                setQuestions([]);

                navigate("/logo");
            } else {
                alert("Some error occurred while creating questions.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit questions.");
        } finally {
            setLoading(false); // Hide loader
        }
    };
    if (loading) {
        return <Loader />; // Render loader while loading
    }


    return (
        // <Container maxWidth="lg" sx={{ mt: 4, mb: 4, background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', color: "white" }}>
        <Box
            sx={{
                minHeight: '100vh', // Ensures it always covers at least the viewport height
                width: '100%',      // Full width
                background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', // Gradient background
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'column', // Allows content to stack vertically
                padding: 3,
                boxSizing: 'border-box',
            }}
        >
            <Grid container
                // check this spacing
                sx={{
                    background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
                    height: "100%",
                    width: "100%",
                    gap: 7,
                    // p: 2
                }}
            >
                <Grid item xs={12} md={3} lg={2}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Navigate Questions
                        </Typography>
                        <List>
                            {questions.map((_, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton
                                        onClick={() => navigateToQuestion(index)}
                                        sx={{
                                            backgroundColor: currentQuestionIndex === index ? "#222222" : "transparent", // Highlight active question
                                            color: currentQuestionIndex === index ? "#fff" : "inherit", // Change text color for active question
                                            "&:hover": {
                                                backgroundColor: currentQuestionIndex === index ? "#232323" : "rgba(255, 255, 255, 0.1)", // Hover effect
                                            },
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <ListItemText primary={`Question ${index + 1}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>


                <Grid item xs={12} md={6} lg={7}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, boxSizing: "border-box" }}>
                        <Typography
                            variant="h5"
                            align="center"
                            gutterBottom
                            sx={{
                                fontFamily: "'Roboto Slab', serif",
                                fontSize: "2rem",
                                color: "#254450",
                            }}
                        >
                            Make a quiz, spark the fun!
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter a creative name for your game"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            variant="outlined"
                            sx={{
                                mb: 4,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    "& fieldset": {
                                        borderColor: "#222222",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#222222",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#ffb74d",
                                    },
                                },
                                "& input": {
                                    fontSize: "1.2rem",
                                    color: "#212121",
                                    background: "#fff",
                                    borderRadius: "5px",
                                    padding: "10px",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontSize: "1.5rem",
                                                color: "#ff9800",
                                                fontFamily: "'Pacifico', cursive",
                                            }}
                                        >
                                            🎮
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <form>
                            {questions[currentQuestionIndex] && (
                                <Box sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                                    <TextField
                                        fullWidth
                                        label={`Question ${currentQuestionIndex + 1}`}
                                        value={questions[currentQuestionIndex].question}
                                        onChange={(e) => handleQuestionChange(currentQuestionIndex, e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel>Question Type</InputLabel>
                                        <Select
                                            value={questions[currentQuestionIndex].type}
                                            onChange={(e) => handleTypeChange(currentQuestionIndex, e.target.value)}
                                        >
                                            <MenuItem value="mcq">Multiple Choice</MenuItem>
                                            <MenuItem value="fill-in-the-blank">Fill in the Blank</MenuItem>
                                            <MenuItem value="image">Image</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {questions[currentQuestionIndex].type === "mcq" && (
                                        <RadioGroup
                                            value={questions[currentQuestionIndex].correctOptionIndex}
                                            onChange={(e) => handleCorrectOptionChange(currentQuestionIndex, parseInt(e.target.value))}
                                        >
                                            {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                                                <Box key={optionIndex} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                                    <TextField
                                                        fullWidth
                                                        label={`Option ${optionIndex + 1}`}
                                                        value={option}
                                                        onChange={(e) => handleOptionChange(currentQuestionIndex, optionIndex, e.target.value)}
                                                    />
                                                    <FormControlLabel
                                                        value={optionIndex}
                                                        control={<Radio />}
                                                        label="Correct"
                                                    />
                                                </Box>
                                            ))}
                                        </RadioGroup>
                                    )}
                                    {questions[currentQuestionIndex].type === "image" && (
                                        <Box>
                                            <Button variant="contained" component="label" sx={{ mb: 2 }}>
                                                Upload Image
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(currentQuestionIndex, e.target.files[0])}
                                                />
                                            </Button>
                                            {questions[currentQuestionIndex].imagePreview && (
                                                <img
                                                    src={questions[currentQuestionIndex].imagePreview}
                                                    alt="Preview"
                                                    style={{ width: "100%", borderRadius: 8 }}
                                                />
                                            )}
                                            <RadioGroup
                                                value={questions[currentQuestionIndex].correctOptionIndex}
                                                onChange={(e) => handleCorrectOptionChange(currentQuestionIndex, parseInt(e.target.value))}
                                            >
                                                {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                                                    <Box key={optionIndex} sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                                                        <TextField
                                                            fullWidth
                                                            label={`Option ${optionIndex + 1}`}
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(currentQuestionIndex, optionIndex, e.target.value)}
                                                        />
                                                        <FormControlLabel
                                                            value={optionIndex}
                                                            control={<Radio />}
                                                            label="Correct"
                                                        />
                                                    </Box>
                                                ))}
                                            </RadioGroup>
                                        </Box>
                                    )}
                                    {questions[currentQuestionIndex].type === "fill-in-the-blank" && (
                                        <TextField
                                            fullWidth
                                            label="Correct Answer"
                                            value={questions[currentQuestionIndex].correctAnswer}
                                            onChange={(e) => handleCorrectAnswerChange(currentQuestionIndex, e.target.value)}
                                        />
                                    )}


                                    {/* check for points options */}
                                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Time Limit (seconds)"
                                            type="number"
                                            value={questions[currentQuestionIndex]?.timeLimit || ""}
                                            onChange={(e) => handleFieldChange(currentQuestionIndex, "timeLimit", e.target.value)}
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Points"
                                            type="number"
                                            value={questions[currentQuestionIndex]?.points || ""}
                                            onChange={(e) => handleFieldChange(currentQuestionIndex, "points", e.target.value)}
                                            sx={{ mb: 2 }}
                                        />
                                    </Box>

                                </Box>
                            )}
                        </form>

                    </Paper>
                </Grid>

                <Grid item xs={12} md={3} lg={2}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Submit Quiz
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
                            <Button variant="contained" color="primary" onClick={addQuestion}>
                                Add Question
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                onClick={() => deleteQuestion(currentQuestionIndex)}
                            >
                                Delete Question
                            </Button>
                            <Button variant="contained" color="success" onClick={handleSubmit}>
                                Submit Questions
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
        // </Container>
    );
};

export default CreateQuestion;