import React, { useState } from 'react';
import { Box, TextField, Select, MenuItem, Typography, Grid } from '@mui/material';



const AddNewQuestion = ({question,setQuestion}) => {
  const [questionType, setQuestionType] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // State for MCQ options

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        padding: 4,
        maxWidth: 500,
        margin: '0 auto',
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add a New Question
      </Typography>

      <TextField
        fullWidth
        label="Enter your question"
        variant="outlined"
        sx={{ mb: 2 }}
        inputProps={{ style: { minWidth: '50%' } }} // Set minimum width to 50%
      />

      <Select
        fullWidth
        value={questionType}
        onChange={handleQuestionTypeChange}
        displayEmpty
        variant="outlined"
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Select Question Type</em>
        </MenuItem>
        <MenuItem value="fill-in-the-blank">Fill in the Blank</MenuItem>
        <MenuItem value="mcq">MCQ</MenuItem>
      </Select>

      {/* Conditional rendering based on question type */}
      {questionType === 'fill-in-the-blank' && (
        <TextField
          fullWidth
          label="Answer"
          variant="outlined"
          sx={{ mb: 2 }}
        />
      )}

      {questionType === 'mcq' && (
        <Grid container spacing={2}>
          {options.map((option, index) => (
            <Grid item xs={6} key={index}> {/* Each option takes up half the width */}
              <TextField
                label={`Option ${index + 1}`}
                variant="outlined"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AddNewQuestion;
