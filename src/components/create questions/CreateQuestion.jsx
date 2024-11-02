import { useEffect,useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddNewQuestion from './add new question/AddNewQuestion'
import { setUserFromLocalStorage } from '../redux files/slices/authSlice';

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

    // create three sections using grid
  return (
    <div><h2>Create Question</h2>


    <div></div>
    <button onClick={addQuestion}>Add Question</button>
    <div>
        {questions.map((_, index) => (
            <AddNewQuestion key={index} />
        ))}
    </div>

    <div></div>
    </div>
  )
}

export default CreateQuestion