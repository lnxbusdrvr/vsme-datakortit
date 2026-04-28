import { useDispatch, useSelector} from 'react-redux'
import { useParams, Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';

import usersService from '../services/usersService';

import { initializeBasic } from '../reducers/basicReducer'
import { initializeComprehensive} from '../reducers/comprehensiveReducer'
import { initializeAnswers } from '../reducers/answersReducer'

import { deleteAnswer, updateAnswer } from '../reducers/answersReducer'

import { validateNumber } from '../utils/formHelpers'


const Answers = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const answers = useSelector(state => state.answers)
  const basic = useSelector(state => state.basic)
  const comprehensive = useSelector(state => state.comprehensive)
  const loggedUser = useSelector(state => state.user)
  const [user, setUser] = useState(null) // user who's info we are viewing
  const [editingAnswerId, setEditingAnswerId] = useState('')
  const [editedValue, setEditedValue] = useState('')
  const [fieldError, setFieldError] = useState({})
  const [editingGroupAnswersIds, setEditingGroupAnswersIds] = useState(null)
  const [editedGroupAnswersValue, setEditedGroupAnswersValue] = useState('')


  useEffect(() => {
    // This is mainly generated with Gemini Prompt AI or Augment AI
    const fetchUser = async () => {
      const userData = await usersService.getUserById(id)
      setUser(userData)
    }
    fetchUser()
    dispatch(initializeBasic())
    dispatch(initializeComprehensive())
    dispatch(initializeAnswers())
  }, [dispatch, id])

  if (!user || !answers)
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
  // This function is mainly generated with Gemini Prompt AI or Augment AI
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

  const startEditing = (answerId, currentValue) => {
    setEditingAnswerId(answerId)
    setEditedValue(currentValue)
  }

  const startEditingGroupAnswers = (answerId, subQuestionId, fieldId, currentValue) => {
    setEditingGroupAnswersIds({ answerId, subQuestionId, fieldId })
    setEditedGroupAnswersValue(currentValue)
  }

  const handleDeleteAnswer = async (answerId) => {
    const confirmDeleteAnswer = window
        .confirm('Haluatko varmasti poistaa vastauksen?')
    if (!confirmDeleteAnswer)
      return

    const answer = answers.find(a => a.id === answerId)

    // If question is, if-yes-show-more question(s),
    // delete next answer(s) too
    if (answer?.questionId.includes('_if_this_q_yes_')) {
      const nextQuestionId = answers
        .find(a => a.questionId
          .startsWith(`if_prev_yes_${answer.questionId}`))
      if (nextQuestionId)
        await dispatch(deleteAnswer(nextQuestionId.id))
    }

    await dispatch(deleteAnswer(answerId))
  }

  // This function is mainly generated with Gemini Prompt AI or Augment AI
  const handleDeleteGroupAnswers = async (answerId, subQsId, fieldId) => {
    const confirmDeleteAnswer = window.confirm('Haluatko varmasti poistaa vastauksen?')
    if (!confirmDeleteAnswer)
      return

    const answer = answers?.find(a => a.id === answerId)

    const deletedGroupAnswers = answer?.groupAnswers?.map(ga => {
      if (ga.subQuestionId === subQsId) {
        const newValues = { ...ga.values }
        delete newValues[fieldId]
        return { ...ga, values: newValues }
      }
      return ga
    }).filter(ga => Object.keys(ga.values).length > 0)

    // If no groupAnswers left, delete answer
    if (deletedGroupAnswers?.length === 0) {
      dispatch(deleteAnswer(answerId))
      return
    }

    // Delete trough update field(s) from inside groupAnswers
    dispatch(updateAnswer(answerId, { groupAnswers: deletedGroupAnswers }))
  }

  const handleUpdateAnswer = async (answerId) => {
    await dispatch(updateAnswer(answerId, { answer: editedValue }))
    clearOrCancelEditing()
  }

  // This function is mainly generated with Gemini Prompt AI or Augment AI
  const handleUpdateGroupAnswers = async (answerId, subQsId, fieldId, fieldType) => {
    const answer = answers?.find(a => a.id === answerId)
    const updatedGroupAnswers = answer?.groupAnswers?.map(ga => {
      const value = fieldType === 'number'
        ? Number(editedGroupAnswersValue)
        : editedGroupAnswersValue

      if (ga.subQuestionId === subQsId) {
        return {
          ...ga,
          values: {
            ...ga.values,
            [fieldId]: { value, fieldType }
          }
        }
      }
      return ga
    })
    await dispatch(updateAnswer(answerId, { groupAnswers: updatedGroupAnswers }))
    clearOrCancelGroupEditing()
  }

  const clearOrCancelEditing = () => {
    setEditingAnswerId(null)
    setEditedValue('')
  }

  const clearOrCancelGroupEditing = () => {
    setEditingGroupAnswersIds('')
    setEditedGroupAnswersValue('')
  }

  // This function's ifs on <Button are partially generated with Gemini Prompt AI or Augment AI
  const canModifyButtons = (answer, subQsId, fieldId, fieldValue) => {
    const isSubQs = subQsId && fieldId && fieldValue

    return (
      <>
        <Button
          variant="primary"
          {...(!isSubQs
            ? { onClick: () => startEditing(answer.id, answer.answer)}
            : { onClick: () => startEditingGroupAnswers(answer.id, subQsId, fieldId, fieldValue)}
          )}
        >
          Muokkaa vastausta
        </Button>
        <Button
          variant="danger"
          {...(!isSubQs
            ? { onClick: () => handleDeleteAnswer(answer.id)}
            : { onClick: () => handleDeleteGroupAnswers(answer.id, subQsId, fieldId)}
          )}
        >
          Poista vastaus
        </Button>
      </>
    )

  }

  const inputFieldSaveAndCancelButtons = (answerId, type, subQsId, fieldId, fieldType) => {
    const isSubQs = subQsId && fieldId

    return (
      <>
        <Button
          variant="success"
          {...(!isSubQs
            ? {onClick: () => {handleUpdateAnswer(answerId)}}
            : {onClick: () => {handleUpdateGroupAnswers(answerId, subQsId, fieldId, fieldType)}}
          )}
        >
          Tallenna
        </Button>
        <Button
          variant="second"
          {...(!isSubQs
            ? {onClick: () => {clearOrCancelEditing()}}
            : {onClick: () => {clearOrCancelGroupEditing()}}
          )}
        >
          Peruuta
        </Button>

      </>
    )
  }

  const editingAnswerInputField = (answerId, type, subQsId, fieldId, fieldType) => {
    const isNumber = type === 'number' || fieldType === 'number'
    // value's attributes value is needed to get clear button to work
    // onKeyDown for number validation

    const isSubQs = subQsId && fieldId && fieldType

    return (
      <>
        <Form.Control
          {...(isNumber ? { type: 'number' } : { as: 'textarea' })}
          {...(!isSubQs
            ? { value: editedValue }
            : { value: editedGroupAnswersValue }
          )}
          onChange={(e) => setEditedValue(e.target.value)}
          {...(!isSubQs
            ? {onChange: (e) => {setEditedValue(e.target.value)}}
            : {onChange: (e) => {setEditedGroupAnswersValue(e.target.value)}}
          )}
          {...(isNumber && {
            onKeyDown: (e) => {
              validateNumber(e, answerId, fieldError, setFieldError)
            }
          })}
        />
        {fieldError[answerId] && <span className="field-error">{fieldError[answerId]}</span>}
        {inputFieldSaveAndCancelButtons(answerId, type, subQsId, fieldId, fieldType)}
      </>
    )
  }

  // Allow only owner and admin to modify answers
  const canModify = (user?.id === id
    || loggedUser?.id === id
    || loggedUser?.role === 'admin')
    && loggedUser?.role !== 'viewer'


  // This return is partially generated with help of Gemini Prompt AI or Augment AI
  return (
    <div key="answers-div" className="answers">
      <h2>{user.name} {user.companyName}:</h2>

      {sortedAnswers.filter(a => a.user.id === id)
        .map((a, aIdx, filteredAnswers) => {

        const moduleName = a.moduleId === 'basic_module'
            ? 'Perusmoduuli'
            : 'Perusmoduuli + kattava moduuli'

        {/* This Function is certainly Mostly AI Generated */}
        const section = module
          .flatMap(m => m.sections)
          .find(s => s.section_id === a.sectionId)

        {/* This Function is certainly Mostly AI Generated */}
        const question = module
          .flatMap(m => m.sections)
          .flatMap(s => s.questions)
          .find(q => q.id === a.questionId)

        {/* Check if this is the first title,header in this section */}
        {/* to not show title,header on every iteratration */}
        {/* This Function is certainly Mostly AI Generated */}
        const isFirstInSection = aIdx === 0 || 
          filteredAnswers[aIdx - 1].sectionId !== a.sectionId

        {/* This Function is certainly mainly AI Generated */}
        const isFirstInQuestion = aIdx === 0 ||
          filteredAnswers[aIdx - 1].questionId !== a.questionId

        {/* Find instruction question in questions */}
        {/* This Function is certainly Mostly AI Generated */}
        const questionIndex = section?.questions.findIndex(q => q.id === a.questionId) ?? -1
        const instructionQuestions = questionIndex > 0
          ? section?.questions.slice(0, questionIndex)
            .reverse()
          .filter((q) => {
            const nextIdx = section.questions.findIndex(sq => sq.id === q.id) + 1
            return nextIdx === questionIndex || section.questions[nextIdx]?.type === 'instruction'
          })
          : []

        return (
          <div key={`module-${aIdx}`} >
            {isFirstInSection && (<p>{moduleName}</p>)}
            {isFirstInSection && section?.header && (<h2>{section?.header}</h2>)}
            {isFirstInSection && (<p className="title-box">{section?.title}</p>)}
            {isFirstInSection && section?.instruction && (<p>{section?.instruction}</p>)}
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
                {editingAnswerId === a.id ? (
                  <>
                    <Form.Check
                      type="radio"
                      label="Ei"
                      checked={editedValue === true}
                      onChange={() => setEditedValue(true)}
                    />
                    <Form.Check
                      type="radio"
                      label="Ei"
                      checked={editedValue === false}
                      onChange={() => setEditedValue(false)}
                    />
                    {inputFieldSaveAndCancelButtons(a.id)}
                  </>
                ) : (
                  <>
                    <p>Vastaus: <strong>{a.type === 'boolean'
                      ? (a.answer ? 'Kyllä' : 'Ei')
                      : a.answer}</strong></p>
                    {canModify && (
                      canModifyButtons(a)
                    )}
                  </>
                )}
              </div>
            )}
            {a.type === 'text' && (
              <div key={`text-answer-${aIdx}`}>
                <p>{question?.question}</p>
                {editingAnswerId === a.id ? (
                  editingAnswerInputField(a.id, a.type, null, null, null)
                ) : (
                  <>
                    <p>Vastaus: <strong>{a.answer}</strong></p>
                    {canModify && (
                      canModifyButtons(a)
                    )}
                  </>
                )}
              </div>
            )}
            {a.type === 'number' && (
              <div key={`number-answer-${aIdx}`}>
                <p>{question?.question}</p>
                {editingAnswerId === a.id ? (
                  editingAnswerInputField(a.id, a.type, null, null, null)
                ) : (
                  <>
                    <p>Vastaus: <strong>{a.answer}</strong></p>
                    {canModify && (
                      canModifyButtons(a)
                    )}
                  </>
                )}
              </div>
            )}
            {a.type === 'group' && (
              <>
               {question?.sub_questions?.map((subQs, subQsIdx) => {
                  const groupAnswer = a.groupAnswers
                    .find(ga => ga.subQuestionId === subQs.id)

                  if (!groupAnswer)
                    return null;

                  return (
                    <div key={`subQs-${subQsIdx}`}>
                      <p>{subQs.title}</p>
                      <p>{subQs.category}</p>
                      {Object.entries(groupAnswer.values).map(([fieldId, fieldData], fIdx) => {
                        const field = subQs?.fields?.find(f => f.id === fieldId)
                        if (!field)
                          return null

                        return (
                          <div key={`subQsField-${fIdx}`}>
                            {field.type === 'text' && (
                              editingGroupAnswersIds?.subQuestionId === subQs.id && editingGroupAnswersIds?.fieldId === fieldId ? (
                                editingAnswerInputField(a.id, a.type, subQs.id, fieldId, field.type)
                              ) : (
                                <>
                                  <p>{field?.label}: <strong>{fieldData.value}</strong></p>
                                  {canModify && (
                                    canModifyButtons(a, subQs.id, fieldId, fieldData.value)
                                  )}
                                </>
                              )
                            )}
                            {field.type === 'number' && (
                              (editingGroupAnswersIds?.subQuestionId === subQs.id && editingGroupAnswersIds?.fieldId === fieldId) ? (
                                editingAnswerInputField(a.id, a.type, subQs.id, fieldId, field.type)
                              ) : (
                                <>
                                  <p>{field?.label}: <strong>{fieldData.value}</strong></p>
                                  {canModify && (
                                    canModifyButtons(a, subQs.id, fieldId, fieldData.value)
                                  )}
                                </>
                              )
                            )}
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
