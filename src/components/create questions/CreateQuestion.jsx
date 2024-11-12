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
                <Grid container alignItems="center"
                sx={{
                            p: 4,
                            minHeight: '100vh',
                            background: 'linear-gradient(to bottom, #1b2735, #090a0f)', // Dark gradient background
                        }}
                >
                    {/* Left Section: Navigation for created questions */}
                    <Grid item xs={12} lg={3}>
                        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, backgroundColor: '#f5f5f5',margin:2,top:0 }}>
                            <Typography variant="h6" align="center" gutterBottom>
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
                    <Grid item xs={12} lg={6}>
                        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
                            <Typography variant="h3" align="center" sx={{ fontWeight: 'bold' }} gutterBottom>
                                Choose an Option
                            </Typography>
                            <Typography variant="body1" align="center" sx={{ color: '#7a7a7a', mb: 3 }}>
                                Join us in the world of programming and turn your ideas into reality. Learn to code and shape the digital future with us.
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
                    <Grid item xs={12} lg={3}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#f5f5f5',margin:2}}>
                            <Typography variant="h6" align="center" gutterBottom>
                                Question Settings
                            </Typography>
    
                            <Typography variant="subtitle1" align="center" sx={{ mb: 1, color: '#333' }}>
                                Game PIN: {gamePin}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'center',mb: 3  }}>
                                <Button variant="contained" color="primary" onClick={addQuestion} sx={{ width: '100%', borderRadius: 2 }}>
                                    Add Question
                                </Button>
                            </Box>
    
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button variant="outlined" color="secondary" onClick={getGamePin} sx={{ width: '100%', mb: 3 }}>
                                    Create Game
                                </Button>
                            </Box>
    
                        </Paper>
                    </Grid>
                </Grid>
    )
}

export default CreateQuestion;