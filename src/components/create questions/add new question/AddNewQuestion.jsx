// import React from "react";

// const AddNewQuestion = () => {
//   return (
//     <div>
//       <input type="text" />
//       <input type="text" />
//     </div>
//   );
// };
import React, { useState } from "react";

const AddNewQuestion = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };
  const handleOptionChange = (index, e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={handleQuestionChange}
      />
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e)}
        />
      ))}
    </div>
  );
};

export default AddNewQuestion;
