import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";

// game pin generator function
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
} from "@mui/material";
import { createGameCollection } from "../../api/FireStoreApi";

const CreateQuestion = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [gamePin, setGamePin] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        dispatch(setUserFromLocalStorage());
        const savedQuestions = JSON.parse(localStorage.getItem("questions"));
        if (savedQuestions) {
            setQuestions(savedQuestions);
        }
    }, [dispatch]);

    const getGamePin = () => {
        const pin = generateGamePin();
        setGamePin(pin);
    };

    const addQuestion = () => {
        const newQuestions = [...questions];
        if (questions[currentQuestionIndex]) {
            newQuestions[currentQuestionIndex] = {
                ...questions[currentQuestionIndex],
            };
        }
        // check where to add players
        newQuestions.push({ question: "", options: ["", "", "", ""], correctOptionIndex: null,correctOptionValue:""});
        setQuestions(newQuestions);
        setCurrentQuestionIndex(newQuestions.length - 1);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
        console.log(questions);
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
            newQuestions[questionIndex].options[optionIndex]; // Store the value
        setQuestions(newQuestions);
        localStorage.setItem("questions", JSON.stringify(newQuestions));
    };


    // generating game pin shuld be managed
 const handleSubmit = async(event) => {
    event.preventDefault();
    getGamePin();
    // Validation to ensure all fields are filled
    if (
        questions.some(
            (q) =>
                !q.question ||
                q.correctOptionIndex === null ||
                q.options.some((option) => !option)
        )
    ) {
        alert(
            "Please fill out all fields and select a correct option for each question."
        );
        return;
    }

    // Preparing data for submission
    const submittedData = {
        gamePin: gamePin || "No Game Pin Set",
        questions: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            correctOptionValue: q.correctOptionValue, // Include value in submission
        })),
    };
    await createGameCollection(user.email,submittedData);
    console.log("Submitted Data:", submittedData);
    alert("done");
};

    return (
        <Container maxWidth="lg" sx={{ 
        mt: 4, 
        mb: 4 ,
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'
        }}>
            <Grid container spacing={3}>
                {/* Left Sidebar */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Navigate Questions
                        </Typography>
                        <List>
                            {questions.map((_, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton onClick={() => navigateToQuestion(index)}>
                                        <ListItemText primary={`Question ${index + 1}`} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Main Content */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" align="center" gutterBottom>
                            Create Questions
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            {questions[currentQuestionIndex] && (
                                <Box
                                    sx={{
                                        mb: 3,
                                        p: 2,
                                        border: "1px solid #ccc",
                                        borderRadius: 2,
                                        backgroundColor: "#f9f9f9",
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label={`Question ${currentQuestionIndex + 1}`}
                                        value={questions[currentQuestionIndex].question}
                                        onChange={(e) =>
                                            handleQuestionChange(currentQuestionIndex, e.target.value)
                                        }
                                        sx={{ mb: 2 }}
                                    />

                                    <RadioGroup
                                        sx={{ pl: 2 }}
                                        value={questions[currentQuestionIndex].correctOptionIndex}
                                        onChange={(e) =>
                                            handleCorrectOptionChange(currentQuestionIndex, parseInt(e.target.value))
                                        }
                                    >
                                        {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                                            <Box
                                                key={optionIndex}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 2,
                                                    p: 2,
                                                    mb: 2,
                                                    borderRadius: 2,
                                                    border:
                                                        questions[currentQuestionIndex].correctOptionIndex ===
                                                            optionIndex
                                                            ? "2px solid #4caf50"
                                                            : "1px solid #ccc",
                                                    backgroundColor:
                                                        questions[currentQuestionIndex].correctOptionIndex ===
                                                            optionIndex
                                                            ? "#e8f5e9"
                                                            : "white",
                                                }}
                                            >
                                                <TextField
                                                    fullWidth
                                                    label={`Option ${optionIndex + 1}`}
                                                    value={option}
                                                    onChange={(e) =>
                                                        handleOptionChange(
                                                            currentQuestionIndex,
                                                            optionIndex,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <FormControlLabel
                                                    value={optionIndex}
                                                    control={<Radio />}
                                                    label=""
                                                />
                                            </Box>
                                        ))}
                                    </RadioGroup>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => deleteQuestion(currentQuestionIndex)}
                                        sx={{ mt: 2 }}
                                    >
                                        Delete Question
                                    </Button>
                                </Box>
                            )}
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button variant="contained" color="primary" onClick={addQuestion}>
                                    Add Question
                                </Button>
                                <Button variant="contained" color="success" type="submit">
                                    Submit Questions
                                </Button>
                            </Box>
                        </form>
                    </Paper>
                </Grid>

                {/* Right Sidebar */}
                <Grid item xs={12} md={3}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" align="center" gutterBottom>
                            Game Settings
                        </Typography>
                        <Typography variant="subtitle1" align="center">
                            Game PIN: {gamePin || "Not Generated"}
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 3 }}
                            onClick={getGamePin}
                        >
                            Generate Game PIN
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default CreateQuestion;
