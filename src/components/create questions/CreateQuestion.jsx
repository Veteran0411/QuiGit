import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddNewQuestion from "./add new question/AddNewQuestion";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";
import "./CreateQuestion.css";
// import "./src/index.css";

const CreateQuestion = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    dispatch(setUserFromLocalStorage());
  }, [dispatch]);

  const addQuestion = () => {
    setQuestions((prevQuestions) => [...prevQuestions, {}]);
  };

  const deleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  // create three sections using grid
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
          {questions.map((_, index) => (
            <div
              key={index}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Option 1"
                    style={{
                      flex: 1,
                      marginRight: "5px",
                      padding: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Option 2"
                    style={{
                      flex: 1,
                      padding: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <input
                    type="text"
                    placeholder="Option 3"
                    style={{
                      flex: 1,
                      marginRight: "5px",
                      padding: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Option 4"
                    style={{
                      flex: 1,
                      padding: "10px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
              <button
                style={{ marginTop: "10px", padding: "5px 10px" }}
                onClick={() => deleteQuestion(index)}
              >
                Delete Question
              </button>
            </div>
          ))}
          <button style={{ padding: "5px 10px" }} onClick={addQuestion}>
            Add Question
          </button>
        </div>
        <div style={{ backgroundColor: "#f0f0f0" }}></div>
      </div>
    </div>
  );
};

export default CreateQuestion;
