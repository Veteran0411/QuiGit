import React from 'react'
import { useSelector } from 'react-redux';

const Test = () => {
    const isAuthenticated=useSelector((state)=>state.auth.isAuthenticated)
  return (
      <div>
          <h1>test</h1>
        {
        isAuthenticated ? (
        <h6>Welcome Back!</h6>
      ) : (
        <h6>Please Log In</h6>
      )}
      </div>
  )
}

export default Test