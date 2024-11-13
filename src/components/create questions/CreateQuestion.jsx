// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import AddNewQuestion from "./add new question/AddNewQuestion";
// import { setUserFromLocalStorage } from "../redux files/slices/authSlice";
// import "./CreateQuestion.css";
// // import "./src/index.css";

// const CreateQuestion = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {
//     dispatch(setUserFromLocalStorage());
//   }, [dispatch]);

//   const addQuestion = () => {
//     setQuestions((prevQuestions) => [...prevQuestions, {}]);
//   };

//   const deleteQuestion = (index) => {
//     const newQuestions = [...questions];
//     newQuestions.splice(index, 1);
//     setQuestions(newQuestions);
//   };

//   // create three sections using grid
//   return (
//     <div
//       className="create-question-container"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "20px",
//       }}
//     >
//       <h2>Create Question</h2>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "1fr 2fr 1fr",
//           gridGap: "0",
//           width: "100%",
//           height: "calc(100vh - 80px)",
//         }}
//       >
//         <div style={{ backgroundColor: "#f0f0f0" }}></div>
//         <div
//           style={{
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//             padding: "15px",
//           }}
//         >
//           {questions.map((_, index) => (
//             <div
//               key={index}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "flex-start",
//                 marginBottom: "15px",
//               }}
//             >
//               <input
//                 type="text"
//                 placeholder="Question"
//                 style={{
//                   width: "100%",
//                   marginBottom: "10px",
//                   padding: "10px",
//                   boxSizing: "border-box",
//                 }}
//               />
//               <div
//                 className="options"
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: "1.2rem",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     marginBottom: "10px",
//                   }}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Option 1"
//                     style={{
//                       flex: 1,
//                       marginRight: "5px",
//                       padding: "10px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Option 2"
//                     style={{
//                       flex: 1,
//                       padding: "10px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>
//                 <div
//                   style={{ display: "flex", justifyContent: "space-between" }}
//                 >
//                   <input
//                     type="text"
//                     placeholder="Option 3"
//                     style={{
//                       flex: 1,
//                       marginRight: "5px",
//                       padding: "10px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                   <input
//                     type="text"
//                     placeholder="Option 4"
//                     style={{
//                       flex: 1,
//                       padding: "10px",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 </div>
//               </div>
//               <button
//                 style={{ marginTop: "10px", padding: "5px 10px" }}
//                 onClick={() => deleteQuestion(index)}
//               >
//                 Delete Question
//               </button>
//             </div>
//           ))}
//           <button style={{ padding: "5px 10px" }} onClick={addQuestion}>
//             Add Question
//           </button>
//         </div>
//         <div style={{ backgroundColor: "#f0f0f0" }}></div>
//       </div>
//     </div>
//   );
// };

// export default CreateQuestion;

/* fully working*/
// in console question and options are stored

// import { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { setUserFromLocalStorage } from "../redux files/slices/authSlice";
// import "./CreateQuestion.css";

// const CreateQuestion = () => {
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.auth.user);
//   const [questions, setQuestions] = useState([]);

//   // Load questions from local storage on component mount
//   useEffect(() => {
//     dispatch(setUserFromLocalStorage());
//     const savedQuestions = JSON.parse(localStorage.getItem("questions"));
//     if (savedQuestions) {
//       setQuestions(savedQuestions);
//     }
//   }, [dispatch]);

//   const addQuestion = () => {
//     setQuestions((prevQuestions) => [
//       ...prevQuestions,
//       { question: "", options: ["", "", "", ""], correctOptionIndex: null },
//     ]);
//   };

//   const deleteQuestion = (index) => {
//     const newQuestions = [...questions];
//     newQuestions.splice(index, 1);
//     setQuestions(newQuestions);
//     localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
//   };

//   const handleQuestionChange = (index, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index].question = value;
//     setQuestions(newQuestions);
//     localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
//   };

//   const handleOptionChange = (questionIndex, optionIndex, value) => {
//     const newQuestions = [...questions];
//     newQuestions[questionIndex].options[optionIndex] = value;
//     setQuestions(newQuestions);
//     localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
//   };

//   const handleCorrectOptionChange = (questionIndex, optionIndex) => {
//     const newQuestions = [...questions];
//     newQuestions[questionIndex].correctOptionIndex = optionIndex;
//     setQuestions(newQuestions);
//     localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
//   };

//   // Function to handle submission with validation
//   const handleSubmit = (event) => {
//     event.preventDefault(); // Prevent default form submission behavior

//     // Validate input
//     if (
//       questions.some(
//         (q) =>
//           !q.question ||
//           q.correctOptionIndex === null ||
//           q.options.some((option) => !option)
//       )
//     ) {
//       alert(
//         "Please fill out all fields and select a correct option for each question."
//       );
//       return;
//     }

//     console.log("Submitted Questions:", questions);

//     // Here you can send `questions` to your backend or perform any action needed
//   };

//   return (
//     <div
//       className="create-question-container"
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         padding: "20px",
//       }}
//     >
//       <h2>Create Question</h2>
//       <form onSubmit={handleSubmit} style={{ width: "100%" }}>
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 2fr 1fr",
//             gridGap: "0",
//             width: "100%",
//             height: "calc(100vh - 80px)",
//           }}
//         >
//           <div style={{ backgroundColor: "#f0f0f0" }}></div>
//           <div
//             style={{
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               padding: "15px",
//             }}
//           >
//             {questions.map((q, questionIndex) => (
//               <div
//                 key={questionIndex}
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "flex-start",
//                   marginBottom: "15px",
//                 }}
//               >
//                 <input
//                   type="text"
//                   placeholder="Question"
//                   value={q.question}
//                   onChange={(e) =>
//                     handleQuestionChange(questionIndex, e.target.value)
//                   }
//                   style={{
//                     width: "100%",
//                     marginBottom: "10px",
//                     padding: "10px",
//                     boxSizing: "border-box",
//                   }}
//                 />
//                 <div
//                   className="options"
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: "1.2rem",
//                   }}
//                 >
//                   {q.options.map((option, optionIndex) => (
//                     <div
//                       key={optionIndex}
//                       style={{ display: "flex", alignItems: "center" }}
//                     >
//                       <input
//                         type="text"
//                         placeholder={`Option ${optionIndex + 1}`}
//                         value={option}
//                         onChange={(e) =>
//                           handleOptionChange(
//                             questionIndex,
//                             optionIndex,
//                             e.target.value
//                           )
//                         }
//                         style={{
//                           width: "100%",
//                           marginBottom: "10px",
//                           padding: "10px",
//                           boxSizing: "border-box",
//                         }}
//                       />
//                       <input
//                         type="radio"
//                         name={`correct-option-${questionIndex}`}
//                         checked={q.correctOptionIndex === optionIndex}
//                         onChange={() =>
//                           handleCorrectOptionChange(questionIndex, optionIndex)
//                         }
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   style={{ marginTop: "10px", padding: "5px 10px" }}
//                   onClick={() => deleteQuestion(questionIndex)}
//                 >
//                   Delete Question
//                 </button>
//               </div>
//             ))}
//             <div style={{ display: "flex", gap: "10px" }}>
//               <button
//                 type="button"
//                 style={{ padding: "5px 10px" }}
//                 onClick={addQuestion}
//               >
//                 Add Question
//               </button>
//               <button type="submit" style={{ padding: "5px 10px" }}>
//                 Submit Questions
//               </button>
//             </div>
//           </div>
//           <div style={{ backgroundColor: "#f0f0f0" }}></div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateQuestion;
// src/components/CreateQuestion.js

// src/components/CreateQuestion.js

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";
import { loadGamePinFromLocalStorage } from "../redux files/slices/gamePinSlice";
import "./CreateQuestion.css";

const CreateQuestion = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const gamePin = useSelector((state) => state.gamePin.pin); // Accessing game pin from Redux store
  const [questions, setQuestions] = useState([]);

  // Load questions and user from local storage on component mount
  useEffect(() => {
    dispatch(setUserFromLocalStorage());
    dispatch(loadGamePinFromLocalStorage()); // Load game pin from local storage
    const savedQuestions = JSON.parse(localStorage.getItem("questions"));
    if (savedQuestions) {
      setQuestions(savedQuestions);
    }
  }, [dispatch]);

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", options: ["", "", "", ""], correctOptionIndex: null },
    ]);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
    localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
    localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
    localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
  };

  const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctOptionIndex = optionIndex;
    setQuestions(newQuestions);
    localStorage.setItem("questions", JSON.stringify(newQuestions)); // Update local storage
  };

  // Function to handle submission with validation
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Validate input
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

    // Prepare the data to log
    const submittedData = {
      gamePin: gamePin || "No Game Pin Set", // Include the game pin or a default message
      questions: questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctOptionIndex: q.correctOptionIndex,
      })),
    };

    // Log the complete data structure
    console.log("Submitted Data:", submittedData);

    // Here you can send `submittedData` to your backend or perform any action needed
  };

  return (
    <div
      className="create-question-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2>Create Question</h2>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 1fr",
            gridGap: "0",
            width: "100%",
            height: "calc(100vh - 80px)",
          }}
        >
          <div style={{ backgroundColor: "#f0f0f0" }}></div>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "15px",
            }}
          >
            {questions.map((q, questionIndex) => (
              <div
                key={questionIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  marginBottom: "15px",
                }}
              >
                <input
                  type="text"
                  placeholder="Question"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(questionIndex, e.target.value)
                  }
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  className="options"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.2rem",
                  }}
                >
                  {q.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <input
                        type="text"
                        placeholder={`Option ${optionIndex + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          marginBottom: "10px",
                          padding: "10px",
                          boxSizing: "border-box",
                        }}
                      />
                      <input
                        type="radio"
                        name={`correct-option-${questionIndex}`}
                        checked={q.correctOptionIndex === optionIndex}
                        onChange={() =>
                          handleCorrectOptionChange(questionIndex, optionIndex)
                        }
                      />
                    </div>
                  ))}
                </div>
                <button
                  style={{ marginTop: "10px", padding: "5px 10px" }}
                  onClick={() => deleteQuestion(questionIndex)}
                >
                  Delete Question
                </button>
              </div>
            ))}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                style={{ padding: "5px 10px" }}
                onClick={addQuestion}
              >
                Add Question
              </button>
              <button type="submit" style={{ padding: "5px 10px" }}>
                Submit Questions
              </button>
            </div>
          </div>
          <div style={{ backgroundColor: "#f0f0f0" }}></div>
        </div>
      </form>
    </div>
  );
};

export default CreateQuestion;
