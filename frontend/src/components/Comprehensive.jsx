import { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

import { initializeComprehensive } from '../reducers/comprehensiveReducer'
import { addAnswer } from '../reducers/answersReducer';

import { getMoreQuestionIdIfCtrlQsYes, validateNumber } from '../utils/formHelpers'
import Answers from './Answers'

import '../styles.css'

const Comprehensive = () => {
  const dispatch = useDispatch()
  const comprehensive = useSelector(state => state.comprehensive)
  const user = useSelector(state => state.user)
  const [answers, setAnswers] = useState({})
  const [corruption, setCorruption] = useState(false)
  const [moduleId, setModuleId] = useState(false)
  const [fieldError, setFieldError] = useState({})
  const [lastControllingQuestionId, setLastControllingQuestionId] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeComprehensive())
  }, [dispatch])

  useEffect(() => {
    if (comprehensive && comprehensive.length > 0)
      setModuleId(comprehensive[0].module_id)
  }, [comprehensive])

  if (!user || !comprehensive)
    return <div>Loading...</div>

  const inputField = (idForNameAndFieldError, sectionId, questionId, type, fieldType, subQuestionId) => {
    const isNumber = type === 'number' || fieldType === 'number'

    return (
      <>
        <Form.Control
          {...(isNumber ? { type: 'number' } : { as: 'textarea' })}
          name={idForNameAndFieldError}
          value={!subQuestionId
            ? (answers[questionId]?.answer || '')
            : (answers[questionId]?.groupAnswers
              ?.find(ga => ga.subQuestionId === subQuestionId)
              ?.values?.[idForNameAndFieldError]?.value  ?? '')
          }
          onChange={({ target }) => !fieldType
            ? handleAnswersChange(sectionId, questionId, type, target.value)
            : handleSubQsAnswersChange(sectionId, questionId, type, subQuestionId, 
              idForNameAndFieldError, fieldType, target.value)
          }
          {...(isNumber && {
            onKeyDown: (e) => {
              validateNumber(e, idForNameAndFieldError, fieldError, setFieldError)
            }
          })} 
      />
      {fieldError[idForNameAndFieldError] && <span className="field-error">{fieldError[idForNameAndFieldError]}</span>}
      </>
    )
  }

  const handleAnswersChange = (sectionId, questionId, type, value) => {
    setAnswers({
      ...answers,
      [questionId]: {
        sectionId,
        type,
        answer: value
      }
    })
  }

  const handleSubQsAnswersChange = (sectionId, questionId, type, subQuestionId, fieldId, fieldType, value) => {
    const existingGroupAnswers = answers[questionId]?.groupAnswers || []
    const subQsIdx = existingGroupAnswers.findIndex(ga => ga.subQuestionId === subQuestionId)

    let updatedGroupAnswers
    if (subQsIdx >= 0) {
      updatedGroupAnswers = [...existingGroupAnswers]
      updatedGroupAnswers[subQsIdx] = {
        ...updatedGroupAnswers[subQsIdx],
        values: {
          ...updatedGroupAnswers[subQsIdx].values,
          [fieldId]: { value, fieldType }
        }
      }
    } else {
      updatedGroupAnswers = [...existingGroupAnswers, {
        subQuestionId,
        values: {
          [fieldId]: { value, fieldType }
        }
      }]
    }

    setAnswers({
      ...answers,
      [questionId]: {
        sectionId,
        type,
        groupAnswers: updatedGroupAnswers
      }
    })
    
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      for (const [questionId, data] of Object.entries(answers)) {
        const payload = {
          moduleId,
          sectionId: data.sectionId,
          questionId,
          type: data.type || 'text',
        }
        if (data.type !== 'group') {
          payload.answer = data.type === 'number' ? Number(data.answer) : data.answer
        } else {
          payload.groupAnswers = data.groupAnswers.map(ga => ({
            subQuestionId: ga.subQuestionId,
            values: Object.fromEntries(
              Object.entries(ga.values).map(([fieldId, field]) => [
                fieldId,
                {
                  value: field.fieldType === 'number'
                    ? Number(field.value)
                    : field.value,
                  fieldType: field.fieldType
                }
              ])
            )
          }))
        }
        await dispatch(addAnswer(payload))
      }
      handleClearAnswers()
      navigate('/Answers')
    } catch (error) {
      console.log('Error submitting answers:', error)
    }

  }

  const handleClearAnswers = () => {
    setAnswers({})
    setCorruption(false)
  }


  return (
    <div key="comprehensive_module-div">
      <Form onSubmit={handleSubmit}>
        <p>
          Tämä raportti on laadittu VSME 17.12.2024 mukaisesti:
          <a href="https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf" target="_blank">https:\/\/www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf</a>
        </p>

        {comprehensive.map((b, bIdx) => (
          <div key={b.id || bIdx} >
            <h1>{b.module}</h1>
            {b.sections.map((s, sIdx) => (
              <div key={`${s.section_id}-${sIdx}`} >
                {s.header && (
                  <h2>{s.header}</h2>
                )}
                {s.title && (
                  <p className="title-box">{s.title}</p>
                )}
                {s.instruction && (
                  <p><strong>{s.instruction}</strong></p>
                )}
                {s.questions.map((qs, qsIdx) => (
                  <div key={`${qs.id}-${qsIdx}`} >
                    {qs.id === 'b1_basic_or_comprehensive_module' ? (
                      <div key={`disabled_basic_or_comprehensive_module-${qsIdx}`} >
                        <p>{qs.question}</p>
                        <Form.Check
                          type="radio"
                          label="Perusmoduuli"
                          checked={false}
                          disabled
                        />
                        <Form.Check
                          type="radio"
                          label="Kattava moduuli"
                          value={b.module_id}
                          checked={true}
                          disabled
                        />
                      </div>
                    ) : (
                      <div key={`other_questions-${qsIdx}`}>
                        {qs.instruction && (
                          <p className="instruction">{qs.instruction}</p>
                        )}
                        {qs.type === 'text' && (
                          <Form.Label>{qs.question}
                            {inputField(qs.id, s.section_id, qs.id, qs.type, null, null)}
                          </Form.Label>
                        )}
                      {qs.type === 'number' && (
                        <Form.Label>{qs.question}
                          {inputField(qs.id, s.section_id, qs.id, qs.type, null, null)}
                        </Form.Label>
                      )}
                      {qs.type === 'boolean' && (
                        <>
                          <Form.Label>{qs.question}</Form.Label>
                          <Form.Check
                            label="Kyllä"
                            type="radio"
                            name={qs.id}
                            checked={answers[qs.id]?.answer === true}
                            onChange={() => {handleAnswersChange(s.section_id, qs.id, qs.type, true)
                              if (qs.id.includes('_if_this_q_yes_'))
                                setLastControllingQuestionId(prev => [...prev, qs.id])
                            }}
                          />
                          <Form.Check
                            label="Ei"
                            type="radio"
                            name={qs.id}
                            checked={answers[qs.id]?.answer === false}
                            onChange={() => {
                              handleAnswersChange(s.section_id, qs.id, qs.type, false)
                              if (qs.id.includes('_if_this_q_yes_'))
                                setLastControllingQuestionId(prev => prev.filter(id => id !== qs.id))
                            }}
                          />
                        </>
                      )}
                    </div>
                )}
                {qs.type === 'group' && (
                  <div key={`group_question-${qsIdx}`} >
                    {qs.sub_questions
                      .filter(fi => !fi.id.startsWith('sub_q_if_prev_yes_'))
                      .map((subQs, subQsIdx) => (
                        <div key={`${subQs.id}-${subQsIdx}`} >
                          {subQs.title && (
                            <b>{subQs.title}</b>
                          )}
                          {subQs.category && (
                            <b>{subQs.category}</b>
                          )}
                          {subQs.fields && subQs.fields.map((f, fIdx) => (
                            <div key={`${f.id}-${fIdx}`} >
                              <Form.Label>{f.label}
                                {f.type === 'number' && (
                                  inputField(f.id, s.section_id, qs.id, f.type, f.type, subQs.id)
                                )}
                                {f.type === 'text' && (
                                  inputField(f.id, s.section_id, qs.id, f.type, f.type, subQs.id)
                                )}
                              </Form.Label>
                            </div>
                          ))}
                        </div>
                    ))}
                  </div>
                )}
                {qs.type === 'group' && lastControllingQuestionId.some(ctrlId => getMoreQuestionIdIfCtrlQsYes(ctrlId) === qs.id) && (
                  <div key={`group_question-supplementary-qs-${qsIdx}`} >
                    {qs.sub_questions
                      .filter(fi => fi.id.startsWith('sub_q_if_prev_yes_'))
                      .map((subQs, subQsIdx) => (
                        <div key={`${subQs.id}-${subQsIdx}`} >
                          {subQs.fields && subQs.fields.map((f, fIdx) => (
                            <div key={`${f.id}-${fIdx}`} >
                              {<p>{subQs.category}</p>}
                              <Form.Label>{f.label}
                                {f.type === 'number' && (
                                  inputField(f.id, s.section_id, qs.id, f.type, f.type, subQs.id)
                                )}
                              </Form.Label>
                            </div>
                          ))}
                        </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
          </div>
        ))}
        <Button variant="contained" type="submit">Tallenna</Button>
        <Button variant="outlined" onClick={() => handleClearAnswers()}>Tyhjennä</Button>
      </Form>
    </div>
  )
}

/*
                {qs.type === 'group' && qs.id === getMoreQuestionIdIfCtrlQsYes(lastControllingQuestionId) && (
                */

export default Comprehensive 
