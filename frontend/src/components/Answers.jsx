import { useDispatch, useSelector} from 'react-redux'
//import { Routes, Route, Link } from 'react-router-dom';
//import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import { initializeAnswers } from '../reducers/answersReducer'

import Notification from './Notification';


const Answers = () => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.answers)
  const user = useSelector(state => state.user)
  const basic = useSelector(state => state.basic)
  //const inclusive = useSelector(state => state.inclusive)
  const [basicOrInclusive, setBasicOrInclusive] = useState()

  useEffect(() => {
    dispatch(initializeAnswers())
  }, [dispatch])

  useEffect(() => {
    if (answers && answers.length > 0)
      setBasicOrInclusive(answers[0].moduleId)
  }, [dispatch])

  console.log(`Answers: ${answers}\nbasicOrInclusive: ${basicOrInclusive}`)

  if (!answers)
    return <div>Loading...</div>

  return (
    <div>
      <h2>Vastaukset</h2>

      <p>{user.name}</p>
      {answers.map((a, idx) => {
        if (a.moduleId === 'basic_module') {
          const question = basic
            .flatMap(b => b.sections)
            .flatMap(s => s.questions)
            .find(q => q.id === a.questionId)

          return (
            <div key={`basic-${idx}`}>
              <p>Kysymys: <strong>{question?.question || a.questionId}</strong></p>
              <p>Vastaus: {a.answer}</p>
            </div>
          )
        }
      })}
    </div>
  );

}


export default Answers
