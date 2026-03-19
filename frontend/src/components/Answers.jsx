import { useDispatch, useSelector} from 'react-redux'
import { useParams, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import usersService from '../services/usersService';

import { initializeBasic } from '../reducers/basicReducer'
import { initializeComprehensive} from '../reducers/comprehensiveReducer'
import { initializeAnswers } from '../reducers/answersReducer'

import { deleteAnswer } from '../reducers/answersReducer'
import { notify } from '../reducers/notificationReducer'


const Answers = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const answers = useSelector(state => state.answers)
  const basic = useSelector(state => state.basic)
  const comprehensive = useSelector(state => state.comprehensive)
  const [user, setUser] = useState(null)


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
    return (<div>Loading...</div>)

  if (answers.filter(a => a.user.id === id).length === 0) {
    return (
      <div>
        <h2>{user.name} {user.companyName}:</h2>
        <p>Käyttäjä ei ole vastaunnut yhteenkään kysymykseen.</p>
      </div>
    )
  }

  const module = (answers[0]?.moduleId === 'basic_module')
    ? basic
    : comprehensive

  // Sort answers like they are in questions
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

    // Get section indexes
    const sectionIndexA = module.flatMap(m => m.sections).indexOf(sectionA)
    const sectionIndexB = module.flatMap(m => m.sections).indexOf(sectionB)

    if (sectionIndexA !== sectionIndexB)
      return sectionIndexA - sectionIndexB

    // If sections are same, sort by question index
    const questionIndexA = sectionA.questions.indexOf(questionA)
    const questionIndexB = sectionB.questions.indexOf(questionB)

    return questionIndexA - questionIndexB
  })

  const handleDeleteAnswer = async (answerId) => {
    try {
      dispatch(deleteAnswer(answerId))
      dispatch(initializeAnswers())
    } catch (error) {
      throw error
    }
  }


  return (
    <div>
      <h2>{user.name} {user.companyName}:</h2>

      {sortedAnswers.filter(a => a.user.id === id).map((a, aIdx, filteredAnswers) => {
        const section = module
          .flatMap(m => m.sections)
          .find(s => s.section_id === a.sectionId)

        const question = module
          .flatMap(m => m.sections)
          .flatMap(s => s.questions)
          .find(q => q.id === a.questionId)

        {/* Check if this is the first title,header in this section */}
        {/* to not show title,header on every iteratration */}
        const isFirstInSection = aIdx === 0 || 
          filteredAnswers[aIdx - 1].sectionId !== a.sectionId

        const isFirstInQuestion = aIdx === 0 ||
          filteredAnswers[aIdx - 1].questionId !== a.questionId

        {/* Find instruction question in questions */}
        const questionIndex = section?.questions.findIndex(q => q.id === a.questionId) ?? -1
        const instructionQuestions = questionIndex > 0
          ? section?.questions.slice(0, questionIndex)
            .reverse()
          .filter((q, idx, arr) => {
            const nextIdx = section.questions.findIndex(sq => sq.id === q.id) + 1
            return nextIdx === questionIndex || section.questions[nextIdx]?.type === 'instruction'
          })
          : []

        return (
          <div key={`module-${aIdx}`}>
            {isFirstInSection && section?.header && (<h2>{section?.header}</h2>)}
            {isFirstInSection && (<p className="title-box">{section?.title}</p>)}
            {isFirstInSection && section?.instruction && (<p>{section?.instruction}</p>)}
            {question?.question && a.type !== 'boolean' && (
              <p>{question?.question}</p>
            )}
            {question?.instruction && (
              <p>{question?.instruction}</p>
            )}
            {/* show instuction with no type */}
            {isFirstInQuestion  && instructionQuestions.map((iq, iqIdx) => (
              <p key={`instruction-${iqIdx}`}>{iq.instruction}</p>
            ))}
            {a.type === 'boolean' && (
              <div key={`boolean-answer-${aIdx}`}>
                <p>{question?.question}</p>
                <p>Vastaus: <strong>{a.type === 'boolean' ? (a.answer ? 'Kyllä' : 'Ei') : a.answer}</strong></p>
                <Button variant="outlined" onClick={() => handleDeleteAnswer(a.id)}>Poista vastaus</Button>
              </div>
            )}
            {a.type === 'group' && (
              <>
                {question?.sub_questions.map((subQs, subQsIdx) => {
                  const groupAnswer = a.groupAnswers
                    .find(ga => ga.subQuestionId === subQs.id)

                  if (!groupAnswer)
                    return null;

                  return (
                    <div key={`subQs-${subQsIdx}`}>
                      <p>{subQs.title}</p>
                      <p>{subQs.category}</p>
                      {Object.entries(groupAnswer.values).map(([fieldId, fieldData], fIdx) => {
                        const field = subQs.fields.find(f => f.id === fieldId)
                        if (!field)
                          return null

                        return (
                          <div key={`subQsField-${fIdx}`}>
                            <p>{field?.label}: <strong>{fieldData.value}</strong></p>
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


export default Answers
