import React from 'react'
import { useSelector } from 'react-redux';

const Test = () => {

    const games={
      gameId:"",
      timeStamp:"",
      questions:[],
      correctOption:"",// string
      gamePin:"",
      createdBy:"email",
      players:[] // tracking score
    }
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