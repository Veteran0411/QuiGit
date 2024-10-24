import React from 'react'
import { useSelector } from 'react-redux';

const Test = () => {
    const isAuthenticated=useSelector((state)=>state.auth.isAuthenticated)
  return (
      <div>
        <div>

        </div>
        <div>

        </div>
        <div>
          
        </div>
      </div>
  )
}

export default Test