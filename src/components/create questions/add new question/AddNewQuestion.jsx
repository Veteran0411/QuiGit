// import React from "react";

// const AddNewQuestion = () => {
//   return (
//     <div>
//       <input type="text" />
//       <input type="text" />
//     </div>
//   );
// };
// import React, { useState } from "react";

// const AddNewQuestion = () => {
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState(["", "", "", ""]);

//   const handleQuestionChange = (e) => {
//     setQuestion(e.target.value);
//   };
//   const handleOptionChange = (index, e) => {
//     const newOptions = [...options];
//     newOptions[index] = e.target.value;
//     setOptions(newOptions);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Question"
//         value={question}
//         onChange={handleQuestionChange}
//       />
//       {options.map((option, index) => (
//         <input
//           key={index}
//           type="text"
//           placeholder={`Option ${index + 1}`}
//           value={option}
//           onChange={(e) => handleOptionChange(index, e)}
//         />
//       ))}
//     </div>
//   );
// };

// export default AddNewQuestion;

// fully working

import React, { useState } from "react";

const AddNewQuestion = ({
  index,
  question,
  options,
  correctAnswer,
  points,
  onQuestionChange,
  onOptionChange,
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
    <div>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={handleQuestionChange}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder={`Option ${optionIndex + 1}`}
              value={option}
              onChange={(e) =>
                handleOptionChange(index, optionIndex, e.target.value)
              }
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
      <button onClick={onDelete}>Delete Question</button>
    </div>
  );
};

export default AddNewQuestion;
