import { useDispatch, useSelector} from 'react-redux'
import { useParams, Link } from 'react-router-dom';
//import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import usersService from '../services/usersService';

import { initializeBasic } from '../reducers/basicReducer'
import { initializeComprehensive} from '../reducers/comprehensiveReducer'
import { initializeAnswers } from '../reducers/answersReducer'

import Notification from './Notification';


const Answers = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const answers = useSelector(state => state.answers)
  const basic = useSelector(state => state.basic)
  const comprehensive = useSelector(state => state.comprehensive)
  const [user, setUser] = useState(null)

  /*
   * TODO:
   * Show answer /per user
   * not all answers by all users
   * TODO:
   * fix duplicate answers to
   * more human readable message
   ******************************/

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await usersService.getUserById(id)
      setUser(userData)
    }
    fetchUser()
    dispatch(initializeBasic())
    dispatch(initializeComprehensive())
    dispatch(initializeAnswers())
  }, [dispatch, id])

  if (!answers || !user)
    return <div>Loading...</div>

  const module = (answers[0]?.moduleId === 'basic_module')
    ? basic
    : comprehensive

  // Sort answers based on sectionId and questionId
  const sortedAnswers = [...answers].sort((a, b) => {
    const questionA = module
      .flatMap(m => m.sections)
      .flatMap(s => s.questions)
      .find(q => q.id === a.questionId)

    const questionB = module
      .flatMap(m => m.sections)
      .flatMap(s => s.questions)
      .find(q => q.id === b.questionId)

    if (!questionA || !questionB)
      return 0

    // Search for indexes
    const sectionA = module.flatMap(m => m.sections).find(s =>
      s.questions.some(q => q.id === a.questionId))
    const sectionB = module.flatMap(m => m.sections).find(s =>
      s.questions.some(q => q.id === b.questionId))

    const sectionIndexA = module.flatMap(m => m.sections).indexOf(sectionA)
    const sectionIndexB = module.flatMap(m => m.sections).indexOf(sectionB)

    if (sectionIndexA !== sectionIndexB) {
      return sectionIndexA - sectionIndexB
    }

    // If sections are same, sort by question index
    const questionIndexA = sectionA.questions.indexOf(questionA)
    const questionIndexB = sectionB.questions.indexOf(questionB)

    return questionIndexA - questionIndexB
  })


  return (
    <div>
      <h2>{user.name} vastaukset:</h2>

      {sortedAnswers.map((a, aIdx) => {
        const question = module
          .flatMap(m => m.sections)
          .flatMap(s => s.questions)
          .find(q => q.id === a.questionId)

        const section = module
          .flatMap(m => m.sections)
          .find(s => s.section_id === a.sectionId)

        // Check if this is the first answer in this section
        const isFirstInSection = aIdx === 0 || 
          sortedAnswers[aIdx - 1].sectionId !== a.sectionId

        return (
          <div key={`basic-${aIdx}`}>
            {isFirstInSection && (
              <p className="title-box">{section?.title}</p>
            )}
            <p>Kysymys: <strong>{question?.question || a.questionId}</strong></p>
            {a.type !== 'group' ? (
              <p>Vastaus: {a.type === 'boolean' ? (a.answer ? 'Kyllä' : 'Ei' ) : a.answer}</p>
            ) : (
              <>
                <p>Alakysymykset:</p>{question?.sub_questions.map((subQs, subQsIdx) => {
                  const groupAnswer = a.groupAnswers
                    .find(ga => ga.subQuestionId === subQs.id)

                  if (!groupAnswer)
                    return null;

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
    )}
  </div>
  )

}

/*
        const question = module
          .flatMap(m => m.sections)
          .flatMap(s => s.questions)
          .find(q => q.id === a.questionId)
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
