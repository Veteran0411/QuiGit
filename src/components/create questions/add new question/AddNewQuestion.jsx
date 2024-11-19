// import React, { useState } from 'react';
// import { Box, TextField, Select, MenuItem, Typography, Grid } from '@mui/material';



// const AddNewQuestion = ({question,setQuestion}) => {
//   const [questionType, setQuestionType] = useState('');
//   const [options, setOptions] = useState(['', '', '', '']); // State for MCQ options

//   const handleQuestionTypeChange = (e) => {
//     setQuestionType(e.target.value);
//   };

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...options];
//     newOptions[index] = value;
//     setOptions(newOptions);
//   };

//   // write a logic to add values in object and call reducer to store it.
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 2,
//         padding: 4,
//         maxWidth: 500,
//         margin: '0 auto',
//         borderRadius: 2,
//         boxShadow: 3,
//         backgroundColor: '#f5f5f5',
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         Add a New Question
//       </Typography>

//       <TextField
//         fullWidth
//         label="Enter your question"
//         variant="outlined"
//         sx={{ mb: 2 }}
//         inputProps={{ style: { minWidth: '50%' } }} // Set minimum width to 50%
//       />

//       <Select
//         fullWidth
//         value={questionType}
//         onChange={handleQuestionTypeChange}
//         displayEmpty
//         variant="outlined"
//         sx={{ mb: 2 }}
//       >
//         <MenuItem value="">
//           <em>Select Question Type</em>
//         </MenuItem>
//         <MenuItem value="fill-in-the-blank">Fill in the Blank</MenuItem>
//         <MenuItem value="mcq">MCQ</MenuItem>
//       </Select>

//       {/* Conditional rendering based on question type */}
//       {questionType === 'fill-in-the-blank' && (
//         <TextField
//           fullWidth
//           label="Answer"
//           variant="outlined"
//           sx={{ mb: 2 }}
//         />
//       )}

//       {questionType === 'mcq' && (
//         <Grid container spacing={2}>
//           {options.map((option, index) => (
//             <Grid item xs={6} key={index}> {/* Each option takes up half the width */}
//               <TextField
//                 label={`Option ${index + 1}`}
//                 variant="outlined"
//                 value={option}
//                 onChange={(e) => handleOptionChange(index, e.target.value)}
//                 fullWidth
//               />
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </Box>
//   );
// };

// export default AddNewQuestion;

import React, { useState } from "react";

const AddNewQuestion = ({
  index,
  question,
  options = [],
  correctAnswer,
  points,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswerChange,
  onDelete,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState(correctAnswer);

  const handleQuestionChange = (e) => {
    onQuestionChange(index, e.target.value);
  };

  const handleOptionChange = (optionIndex, value) => {
    onOptionChange(index, optionIndex, value);
  };

  const handleCorrectAnswerChange = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    onCorrectAnswerChange(index, optionIndex);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={handleQuestionChange}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder={`Option ${optionIndex + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
              style={{ flex: 1, marginRight: "10px" }}
            />
            <input
              type="radio"
              name={`correct-answer-${index}`}
              checked={selectedAnswer === optionIndex}
              onChange={() => handleCorrectAnswerChange(optionIndex)}
            />
          </div>
        ))}
      </div>
      <button onClick={onDelete} style={{ marginTop: "10px", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "5px 10px", cursor: "pointer" }}>
        Delete Question
      </button>
    </div>
  );
};

export default AddNewQuestion;
