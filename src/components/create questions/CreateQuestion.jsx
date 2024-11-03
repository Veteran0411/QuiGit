import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddNewQuestion from './add new question/AddNewQuestion'
import { setUserFromLocalStorage } from '../redux files/slices/authSlice';

// mui imports
import { Container, Button, Typography, Box, Paper, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

// testing imports
import { generateGamePin } from './game pin generator/gamePinGenerator';

const CreateQuestion = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [questions, setQuestions] = useState([]);
    const [gamePin,setGamePin]=useState("");
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState({ text: '', type: '', options: ['', '', '', ''] });// For MCQ

    useEffect(() => {
        dispatch(setUserFromLocalStorage());
    }, [dispatch]);

    const addQuestion = () => {
        setQuestions((prevQuestions) => [...prevQuestions, { text: `Question ${prevQuestions.length + 1}` }]);
        setCurrentQuestion({ text: '', type: '', options: ['', '', '', ''] }); // Reset current question after adding
        setSelectedQuestionIndex(questions.length); // Set the new question as selected
    };
    // game pin generation successful
    const getGamePin=()=>{
        const pin=generateGamePin();
        setGamePin(pin);
    }

    const handleQuestionClick = (index) => {
        setSelectedQuestionIndex(index);
        setCurrentQuestion(questions[index]); // Load the selected question for editing
    };

    // change the section into more good format
    return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={2}>
                {/* Left Section: Navigation for created questions */}
                <Grid item xs={12} lg={2.5}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6" gutterBottom>
                            Navigate Questions
                        </Typography>
                        <List>
                            {questions.map((question, index) => (
                                <ListItem key={index} disablePadding>
                                    <ListItemButton onClick={() => handleQuestionClick(index)}>
                                        <ListItemText primary={question.text} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Middle Section: Main Question Creation Area */}
                <Grid item xs={12} lg={7}>
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#f9f9f9' }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Create a New Question
                        </Typography>

                        <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <AddNewQuestion 
                                question={currentQuestion} // Pass the current question
                                setQuestion={setCurrentQuestion} // Function to update current question
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Right Section: Question Type and Additional Settings */}
                <Grid item xs={12} lg={2.5}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5' }}>
                        <Typography variant="h6" gutterBottom>
                            Question Settings
                        </Typography>

                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Game PIN: {gamePin}
                        </Typography>

                        <Button variant="outlined" color="secondary" onClick={getGamePin} sx={{ mb: 3 }}>
                            Create Game
                        </Button>

                        <Typography variant="body1" gutterBottom>
                            Select Question Type:
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="contained" color="primary" onClick={addQuestion}>
                                Add Question
                            </Button>
                        </Box>

                        {/* You can add more settings here as needed */}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
}

export default CreateQuestion;