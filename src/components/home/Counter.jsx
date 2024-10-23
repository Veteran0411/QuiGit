import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from '../redux files/slices/counterSlice';
import { login, logout } from '../redux files/slices/authSlice';

const Counter = () => {

    // use useSelector to print or access values in components and dispatch to update
    const count = useSelector((state) => state.counter.value);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const dispatch = useDispatch();
    return (
        <div>
            <h1>{count}</h1>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>


            <h2>Authentication</h2>
            <p>{isAuthenticated ? 'Logged In' : 'Logged Out'}</p>
            <button onClick={() => dispatch(login())}>Log In</button>
            <button onClick={() => dispatch(logout())}>Log Out</button>
        </div>
    )
}

export default Counter;