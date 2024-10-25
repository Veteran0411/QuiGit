import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SignOutApi } from '../../api/AuthApi';
import { setUserFromLocalStorage } from '../redux files/slices/authSlice';
import UserDetails from '../user details/UserDetails';
import CreateOrJoin from '../create or join/CreateOrJoin';

// mui imports

import { Grid, styled } from '@mui/material';

const GridContainer = styled(Grid)`
    height:100vh;
`
const CreateOrJoinContainer = styled(Grid)`
    display:flex;
  justify-content:center;
  align-items:center;
`
const UserDetailsContainer = styled(Grid)`
 display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  /* Right border for larger screens */
  // &::after {
  //   content: '';
  //   position: absolute;
  //   right: 0;
  //   top: 15%; /* 12.5% empty at top */
  //   bottom: 15%; /* 12.5% empty at bottom */
  //   width: 1px;
  //   background-color: black;
  // }

  /* Media query for small screens (mobile) */
  // @media (max-width: 600px) {
  //   &::after {
  //     top: auto;
  //     bottom: 0; /* Move the border to the bottom */
  //     left: 15%; /* Empty space on left side */
  //     right: 15%; /* Empty space on right side */
  //     height: 1px;
  //     width: auto;
  //   }
  // }
`

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  // add logic to check is not authenticated then traverse back to home page
  useEffect(() => {
    if(!user){
      dispatch(setUserFromLocalStorage());
      console.log("home.jsx",user);
    }
  }, [dispatch,user])

  return (<>
    <GridContainer container>
      {user?.displayName?
        <CreateOrJoinContainer item lg={12} xs={12}>
          <CreateOrJoin />
        </CreateOrJoinContainer>
        : <>
          <UserDetailsContainer item lg={12} xs={12}>
            <UserDetails />
          </UserDetailsContainer>
        </>}
    </GridContainer>

  </>
  )
}

export default Home;