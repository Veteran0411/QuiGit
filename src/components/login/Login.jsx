import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Box, Grid, Hidden, InputBase, styled, Typography } from '@mui/material'
import { toast } from "react-toastify";
import { LoginApi, RegisterApi, SignOutApi } from '../../api/AuthApi';

import { forgotPasswordCall } from '../../api/FireStoreApi';

//icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '../common/Loader';
import { auth } from '../../firebaseConfig';
import { useSelector } from 'react-redux';
import BlobSvg from '../svg/BlobSvg';
import "./login.css"

// tilt

// styled
const GridContainer = styled(Grid)`
    height:100vh;
`
const CardContainer = styled(Grid)`
    display:flex;
    justify-content:center;
    align-items:center;
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
`
const LogoContainer = styled(Grid)`
    display:flex;
    position:relative;
    justify-content:center;
    align-items:center;
    font-size:9rem;
    font-weight:400;
    // font-family: "Nosifer", sans-serif;
    font-family: "Reggae One", serif;
    // background: linear-gradient(90deg, rgba(179,35,242,1) 25%, rgba(119,118,255,1) 98%);
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    background-clip: text; /* Clipping the background to the text */
    color: transparent; /* Make text color transparent */
`

const Card = styled(Grid)`
  color:white;
  height:60vh;
  border-radius:10px;
  box-sizing:border-box;
  padding:1rem;
  transform: rotateY(10deg);
`
const FormHeader = styled(Typography)`
    font-size:2rem;
    display:flex;
    justify-content:center;
    align-items:center;
    font-weight:700;
    margin-bottom:2rem;
    font-family: "Noto Sans", sans-serif;
    letter-spacing:2px;
`
const Form = styled("form")({
    color: "white",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "2.5rem",
})

const Input = styled(InputBase)`
    font-family: "Noto Sans", sans-serif;
    color:white;
    width:80%;
    box-sizing:border-box;
    border-bottom:2px solid white;
    font-weight:700;  

    & ::placeholder{
    font-weight:800;
    }
`
const SignUpLabel = styled(Box)`
    margin-top:2rem;
    display:flex;
    justify-content:center;
    font-family: "Noto Sans", sans-serif;
    align-items:center;
    cursor:pointer;
`

const IconContainer = styled('div')({
    position: "relative",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
})
const Icon = styled('div')({
    position: "absolute",
    top: 0,
    right: 37,
    cursor: "pointer"
})

const ToggleText = styled(Box)`
color:white;
font-weight:600;
font-family: "Noto Sans", sans-serif;
cursor:pointer;
letter-spacing:0.5px;
`

// Main functional component
const loginInitialValues = {
    email: "",
    password: "",
}
const signUpInitialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
}

const Login = () => {

    const [loginValues, setLoginValues] = useState(loginInitialValues);
    const [signUpValues, setSignUpValues] = useState(signUpInitialValues);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [forgotEmail, setForgotEmail] = useState("");
    const [isForgotPassword, setForgotPassword] = useState(false);

    // navigate object
    const navigate = useNavigate();
    // check this later
    useEffect(() => {
        onAuthStateChanged(auth, (res) => {
            if (res?.accessToken && res.emailVerified) {
                setLoading(false);
                // console.log(res)
                // create home page to navigate
                // remove set loading and use store and actions to store user details in redux files
                navigate("/home");
            } else {
                setLoading(false);
            }
        })
    }, [])

    const toggleSignUpLabel = () => {
        setLoginValues(loginInitialValues);
        setSignUpValues(signUpInitialValues);
        setIsSignUp(isSignUp => !isSignUp);
        setIsVisible(true)
    }

    const updateInputFields = (e, formType) => {
        if (formType === 'login') setLoginValues({ ...loginValues, [e.target.name]: e.target.value });
        else setSignUpValues({ ...signUpValues, [e.target.name]: e.target.value });
    }

    const validateForm = async (e) => {
        e.preventDefault();

        // Email regex
        const emailRegex = /^.+\.git\.edu$/;

        // Password regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

        if (isSignUp) {
            try {
                const emailValid = emailRegex.test(signUpValues.email);
                const passwordValid = passwordRegex.test(signUpValues.password);

                if (!emailValid) {
                    toast.error("Invalid email. use College email");
                    return;
                }

                if (!passwordValid) {
                    toast.warning("Password should be at least 8 characters long and contain upper case, lower case, and special characters.");
                    return;
                }

                const emailUsername = signUpValues.email.split("-t")[0]; // Extract username part of the email
                if (signUpValues.password.includes(emailUsername)) {
                    toast.error("Password should not contain part of your email.");
                    return;
                }

                if (signUpValues.password !== signUpValues.confirmPassword) {
                    toast.error("Passwords didn't match.");
                    return;
                }

                let res = await RegisterApi(signUpValues.email, signUpValues.password);
                if (res.success) {
                    setLoginValues(loginInitialValues);
                    setSignUpValues(signUpInitialValues);
                    setIsSignUp(false);
                    toast.info("E-mail verification sent to registered email.");
                } else if (res.error === "Email already in use") {
                    toast.error("E-mail already in use.");
                } else {
                    toast.error("Error while signing up.");
                }
            } catch (err) {
                toast.error("Error while signing up.");
            }
        } else {
            try {
                const emailValid = emailRegex.test(loginValues.email);
                const passwordValid = passwordRegex.test(loginValues.password);

                if (!emailValid) {
                    toast.error("Invalid email. Use college Email");
                    return;
                }

                if (!passwordValid) {
                    toast.error("Invalid password.");
                    return;
                }

                let res = await LoginApi(loginValues.email, loginValues.password);
                if (!res.user.emailVerified) {
                    toast.warning("Email verification pending.");
                } else {

                    // the value is changed but not persisted
                    toast.success("Login successful, navigate now.");
                    console.log("navigating inside login call");
                    navigate("/home");

                }
            } catch (err) {
                toast.error("Invalid credentials.");
            }
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const emailRegex = /^.+\.git\.edu$/;
        const emailValid = emailRegex.test(forgotEmail);

        if (!emailValid) {
            toast.error("Invalid email. Use college email");
            return;
        }

        const response = await forgotPasswordCall(forgotEmail);
        if (response.success) {
            toast.success(response.message);
            setForgotPassword(false); // Close forgot password form
            forgotEmail("");
        } else {
            toast.error(response.error);
        }
    };


    return (
        loading ? <Loader /> :
            <GridContainer container>
                <LogoContainer item lg={6} md={12} style={{ position: "relative" }}>
                    <Hidden mdDown>
                        QuiG!t
                    </Hidden>
                </LogoContainer>

                <CardContainer container item lg={6} xs={12} md={12}>

                    <Card item lg={6} xs={10} md={10}>

                        {
                            isForgotPassword ? <>
                                <FormHeader>Forgot Password</FormHeader>
                                <Form onSubmit={(e) => handleForgotPassword(e)} >
                                    <Input placeholder="Enter your email" name='email' type='email' onChange={(e) => setForgotEmail(e.target.value)} required autoComplete='off' value={forgotEmail} />
                                    <Input type='submit' sx={{
                                        cursor: 'pointer',
                                        backgroundColor: "white",
                                        color: 'black',
                                        fontWeight: "700",
                                        padding: "0.3rem",
                                        borderRadius: "5px",
                                    }} value="send Link" />

                                </Form>
                            </>
                                : <>
                                    <FormHeader>{isSignUp ? "Sign up" : "Login"}</FormHeader>
                                    <Form onSubmit={(e) => validateForm(e)} >
                                        {
                                            isSignUp ?
                                                <>
                                                    {/* <Input placeholder="Enter your name" name="name" type='text' onChange={(e) => updateInputFields(e, 'signUp')} value={signUp.name} required /> */}
                                                    <Input placeholder="Enter your email" name='email' type='email' onChange={(e) => updateInputFields(e, 'signUp')} value={signUpValues.email} required autoComplete='off' />
                                                    <IconContainer>
                                                        <Input placeholder="Enter your password" name="password" type={isVisible ? "password" : "text"} onChange={(e) => updateInputFields(e, 'signUp')} value={signUpValues.password} required autoComplete='off' />
                                                        <Icon onClick={() => (setIsVisible(isVisible => !isVisible))}>
                                                            {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                        </Icon>
                                                    </IconContainer>
                                                    <Input placeholder="Confirm your password" name="confirmPassword" type='password' onChange={(e) => updateInputFields(e, 'signUp')} value={signUpValues.confirmPassword} required autoComplete='off' />
                                                    <Input type='submit' sx={{
                                                        cursor: 'pointer',
                                                        backgroundColor: "white",
                                                        color: 'black',
                                                        fontWeight: "700",
                                                        padding: "0.3rem",
                                                        borderRadius: "5px",
                                                    }}
                                                    />
                                                </>
                                                :
                                                <>
                                                    <Input placeholder="Enter your email" name='email' type='email' onChange={(e) => updateInputFields(e, 'login')} value={loginValues.email} required autoComplete='off' />

                                                    <IconContainer>
                                                        <Input placeholder="Enter your password" name="password" type={isVisible ? "password" : "text"} onChange={(e) => updateInputFields(e, 'login')} value={loginValues.password} required autoComplete='off' />
                                                        <Icon onClick={() => (setIsVisible(isVisible => !isVisible))}>
                                                            {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                        </Icon>
                                                    </IconContainer>
                                                    <Input type='submit' sx={{
                                                        cursor: 'pointer',
                                                        backgroundColor: "white",
                                                        color: 'black',
                                                        fontWeight: "700",
                                                        padding: "0.3rem",
                                                        borderRadius: "5px",
                                                    }} />
                                                </>
                                        }
                                    </Form>
                                    <SignUpLabel onClick={() => toggleSignUpLabel()}>
                                        <Box sx={{
                                            // color: 'black',
                                            fontWeight: "600",
                                            // backgroundColor: "white",
                                            width: "15rem",
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            borderRadius: "15px"
                                        }}>{isSignUp ? <ToggleText>Login</ToggleText>
                                            : <ToggleText>Sign Up</ToggleText>}</Box>
                                    </SignUpLabel>
                                </>
                        }






                        <div onClick={() => setForgotPassword(!isForgotPassword)}
                            style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1.5rem", fontWeight: "600" }}
                        >{isForgotPassword ? "Log In" : "Forgot password"}</div>
                    </Card>
                </CardContainer>
            </GridContainer>
    )
}

export default Login;
