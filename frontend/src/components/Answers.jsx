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

  if (!answers)
    return <div>Loading...</div>

  return (
    <div>
      <h2>{user.name} vastaukset:</h2>

      {answers.map((a, idx) => {
        if (a.moduleId === 'basic_module') {
          const question = basic
            .flatMap(b => b.sections)
            .flatMap(s => s.questions)
            .find(q => q.id === a.questionId)

          return (
            <div key={`basic-${idx}`}>
              <p>Kysymys: <strong>{question?.question || a.questionId}</strong></p>
              {a.type !== 'group' ? (
                <p>Vastaus: {a.type === 'boolean' ? (a.answer ? 'Kyllä' : 'Ei' ) : a.answer}</p>
              ) : (
                <>
                  {question?.sub_questions.map((subQs, subQsIdx) => {
                    const groupAnswer = a.groupAnswers
                      .find(ga => ga.subQuestionId === subQs.id)

                    if (!groupAnswer) return null;

                    return (
                      <div key={`subQs-${subQsIdx}`}>
                        <p>Alakysymys: <strong>{subQs.category}</strong></p>
                        {Object.entries(groupAnswer.values).map(([fieldId, fieldData], fIdx) => {
                          const field = subQs.fields.find(f => f.id === fieldId)
                          if (!field)
                            return null

                          return (
                            <div key={`subQsField-${fIdx}`}>
                              <p>{field.label}: {fieldData.value}</p>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </>
              )}
            </div>
            )
          }
      })}
    </div>
  )

}

/*
 * p
                  <p>Alakysymykset:</p>
                  {a.groupAnswers.map((ga, gaIdx) => (
                    <div key={`ga-${gaIdx}`}>
                    {question?.sub_questions.map((subQs, subQsIdx) => (
                      ga.subQuestionId === subQs.id && (
                        <div key={`subQs-${subQsIdx}`}>
                          <p>Alakysymys: <strong>{subQs.category}</strong></p>
                          {subQs.fields.map((f, fIdx) => {
                            const fieldValue = ga.values?.[f.id]?.value;
                            return (
                              <div key={`subQsField-${fIdx}`}>
                                <p>{f.label}: {fieldValue}</p>
                              </div>
                            );
                          })}
                        </div>
                      )))}
                    </div>
                  ))}
                          */

export default Answers
