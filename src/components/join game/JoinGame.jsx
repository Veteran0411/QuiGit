import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SignOutApi } from "../../api/AuthApi";
import { setUserFromLocalStorage } from "../redux files/slices/authSlice";

import { toast } from "react-toastify";


// mui imports
import { Box, Button, TextField, Typography } from '@mui/material';
import { joinGame } from "../../api/FireStoreApi";

const JoinGame = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    const [gamePin, setGamePin] = useState('');

    // add logic to check is not authenticated then traverse back to home page
    useEffect(() => {
        if (!user) {
            dispatch(setUserFromLocalStorage());
        }
    }, [dispatch, user]);

    const handleInputChange = (event) => {
        setGamePin(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await joinGame(user.email, gamePin);
        try{
            if (res) {
                toast.success("Joined Game.")
            } else {
                toast.dark("Game pin Does not Exists");
            }
        }catch(e){
            console.log("error while joining");
        }
        // Add logic to handle the game pin submission
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
        >
            <Typography variant="h4" gutterBottom>
                Join Game
                {/* {user.displayName} */}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Enter game pin"
                    variant="outlined"
                    value={gamePin}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Submit
                </Button>
            </form>
            <div onClick={() => SignOutApi()}>Signout</div>
        </Box>
    )
}

export default JoinGame;