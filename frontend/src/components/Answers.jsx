import { useDispatch, useSelector} from 'react-redux'
//import { Routes, Route, Link } from 'react-router-dom';
//import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

import { initializeUsers } from '../reducers/usersReducer'
import { initializeAnswers } from '../reducers/answersReducer'

import Notification from './Notification';


const Answers = () => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.answers)
  const user = useSelector(state => state.user)
  //const basic = useSelector(state => state.basic)
  //const inclusive = useSelector(state => state.inclusive)

  useEffect(() => {
    dispatch(initializeUsers())
    dispatch(initializeAnswers())
  }, [dispatch])

  console.log(`Answers: ${answers}`)

  if (!answers)
    return <div>Loading...</div>

  return (
    <div>
      <Notification />
      <h2>Vastaukset</h2>

      <p>{user.id}</p>
      <p>{user.name}</p>
      {answers.map((a, idx) => (
        <div key={idx}>
          <p>{a.moduleId}</p>
          <p>{a.sectionId}</p>
          <p>{a.questionId}</p>
          <p>{a.answer}</p>
        </div>
      ))}






    </div>
  );
}

export default Answers
