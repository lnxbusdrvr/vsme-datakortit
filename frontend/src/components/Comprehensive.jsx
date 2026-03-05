import { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux'
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

//import { initializeComprehensive } from '../reducers/comprehensiveReducer'
import { addAnswer } from '../reducers/answersReducer';

import Answers from './Answers'

import '../styles.css'

const Comprehensive = () => {
  /*
  const dispatch = useDispatch()
  const comprehensive = useSelector(state => state.comprehensive)
  const user = useSelector(state => state.user)
  const [answers, setAnswers] = useState({})
  const [showSubQuestions, setShowSubQuestions] = useState(false)
  const [moduleId, setModuleId] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(initializeComprehensive())
  }, [dispatch])

  useEffect(() => {
    if (basic && basic.length > 0)
      setModuleId(comprehensive[0].module_id)
  }, [basic])

  if (!user || !comprehensive)
    return <div>Loading...</div>

  const handleAnswersChange = (sectionId, questionId, type, value) => {
    if (type === 'boolean' && value === true)
      setShowSubQuestions(true)

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
      // update data
      updatedGroupAnswers = [...existingGroupAnswers]
      updatedGroupAnswers[subQsIdx] = {
        ...updatedGroupAnswers[subQsIdx],
        values: {
          ...updatedGroupAnswers[subQsIdx].values,
          [fieldId]: { value, fieldType }
        }
      }
    } else {
      // create new
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
          // Cast numbers in groupAnswers do ensure it's real number
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

  const handleVerifyNumber = (e, questionId) => {
    const allowedKeys = ['Backspace', 'Delete',
      'Tab', 'Escape', 'Enter', 'ArrowLeft',
      'ArrowRight', 'ArrowUp', 'ArrowDown']

    if (allowedKeys.includes(e.key) || e.ctrlKey
      || e.metaKey) {
      return
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      setFieldErrors({...fieldErrors, [qs.id]: 'Vain numerot ovat sallittuja'})
      setTimeout(() => setFieldErrors({...fieldErrors, [qs.id]: null}), 3000)
    }
  }

  */

  return (<h1>Kattava moduuli</h1>)

  /*
  return (
    <Form onSubmit={handleSubmit}>
      <p>
        Tämä raportti on laadittu VSME 17.12.2024 mukaisesti:
        <a href="https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf" target="_blank">https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf</a>
      </p>

      {comprehensive.map((c, cIdx) => (
        <div key={c.id || cIdx} >
          <h1>{c.module}</h1>
          {c.sections.map((s, sIdx) => (
            <div key={`${s.section_id}-${sIdx}`} >
              {s.header && <h2>{s.header}</h2>}
              {s.title && <p className="title-box">{s.title}</p>}
              {s.instruction && <p><strong>{s.instruction}</strong></p>}

              {s.questions.map((qs, qsIdx) => (
                <div key={`${qs.id}-${qsIdx}`} >
                  {qs.id === 'b1_basic_or_comprehensive_module' ? (
                    <div key={`disabled_basic_or_compr_module-${qsIdx}`} >
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
                        value={c.module_id}
                        checked={true}
                        disabled
                      />
                    </div>
                  ) : (
                    <div key={`other_questions-${qsIdx}`}>
                      {qs.type === 'text' && (
                        <Form.Label>{qs.question}
                          {/* value's value is needed to get clear button to work */}
                          {/*}
                          <Form.Control
                            as="textarea"
                            name={qs.id}
                            value={answers[qs.id]?.answer || ''}
                            onChange={({ target }) => handleAnswersChange(s.section_id, qs.id, qs.type, target.value)}
                          />
                        </Form.Label>
                      )}
                      {qs.type === 'number' && (
                        <Form.Label>{qs.question}
                          {/* value's value is needed to get clear button to work */}
                          {/* onKeyDown for number validation */}
                          {/*}
                          <Form.Control
                            type="number"
                            name={qs.id}
                            value={answers[qs.id]?.answer || ''}
                            onChange={({ target }) => handleAnswersChange(s.section_id, qs.id, qs.type, target.value)}
                            onKeyDown={(e) => {
                              const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft',
                                'ArrowRight', 'ArrowUp', 'ArrowDown']

                              if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey)
                                return

                              if (!/^[0-9]$/.test(e.key)) {
                                e.preventDefault()
                                setFieldErrors({...fieldErrors, [qs.id]: 'Vain numerot ovat sallittuja'})
                                setTimeout(() => setFieldErrors({...fieldErrors, [qs.id]: null}), 3000)
                              }
                            }}
                          />
                          {/* Show error message */}
                          {/*}
                          {fieldErrors[qs.id] && <span className="field-error">{fieldErrors[qs.id]}</span>}
                        </Form.Label>
                      )}
                      {qs.type === 'boolean' && (
                        <>
                          {/* checked's value is needed to get clear button to work */}
                          {/*}
                          <Form.Label>{qs.question}</Form.Label>
                          <Form.Check
                            label="Kyllä"
                            type="radio"
                            name={qs.id}
                            checked={answers[qs.id]?.answer === true}
                            onChange={() => handleAnswersChange(s.section_id, qs.id, qs.type, true)}
                          />
                          <Form.Check
                            label="Ei"
                            type="radio"
                            name={qs.id}
                            checked={answers[qs.id]?.answer === false}
                            onChange={() => handleAnswersChange(s.section_id, qs.id, qs.type, false)}
                          />
                          {showSubQuestions && qs.type === 'group' && qs.sub_questions && (
                            <div key={`${qs.id}-${qsIdx}`} >
                              <p>{qs.instruction}</p>
                              {qs.sub_questions.map((subQs, subQsIdx) => (
                                <div key={`${subQs.id}-${subQsIdx}`} >
                                  {subQs.title && (
                                    <b>{subQs.title}</b>
                                  )}
                                  <p>{subQs.category}</p>
                                  {!subQs.title && subQs.fields && subQs.fields.map((f, fIdx) => (
                                    <div key={`${f.id}-${fIdx}`} >
                                      <Form.Label>{f.label}
                                        <Form.Control
                                          type="number"
                                          name={f.id}
                                          value={answers[qs.id]?.groupAnswers?
                                            .find(ga => ga.subQuestionId === subQs.id)?
                                            .values?.[f.id]?.value  ?? ''}
                                          onChange={({ target }) => handleSubQsAnswersChange(s.section_id,
                                            qs.id, qs.type, subQs.id, f.id, f.type, target.value)}
                                          onKeyDown={(e) => {
                                            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape',
                                              'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
                                            if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey)
                                              return

                                            if (!/^[0-9]$/.test(e.key)) {
                                              e.preventDefault()
                                              setFieldErrors({...fieldErrors, [f.id]: 'Vain numerot ovat sallittuja'})
                                              setTimeout(() => setFieldErrors({...fieldErrors, [f.id]: null}), 3000)
                                            }}
                                          }
                                        />
                                      </Form.Label>
                                    </div>
                                  )}
                                </laadittuv>
                              )}
                            </div>

                          )}
                        </>
                      )}
                  </div>
                )}
                {!showSubQuestions && qs.type === 'group' &&
                    (qs.id !== 'management_if_corruption' &&
                      qs.id !== 'management_corruption_details') && (
                  <div key={`${qs.id}-${qsIdx}`} >
                    <p>{qs.instruction}</p>
                    {qs.sub_questions.map((subQs, subQsIdx) => (
                      <div key={`${subQs.id}-${subQsIdx}`} >
                        {subQs.title && (
                          <b>{subQs.title}</b>
                        )}
                        <p>{subQs.category}</p>
                        {!subQs.title && subQs.fields.map((f, fIdx) => (
                          <div key={`${f.id}-${fIdx}`} >
                            {f.type === 'number' && (
                              <Form.Label>{f.label}
                                <Form.Control
                                  type="number"
                                  name={f.id}
                                  value={answers[qs.id]?.groupAnswers?.find(ga => ga.subQuestionId === subQs.id)?.values?.[f.id]?.value  ?? ''}
                                  onChange={({ target }) => handleSubQsAnswersChange(s.section_id,
                                    qs.id, qs.type, subQs.id, f.id, f.type, target.value)}
                                  onKeyDown={(e) => {
                                    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape',
                                      'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
                                    
                                    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey)
                                      return

                                    if (!/^[0-9]$/.test(e.key)) {
                                      e.preventDefault()
                                      setFieldErrors({...fieldErrors, [f.id]: 'Vain numerot ovat sallittuja'})
                                      setTimeout(() => setFieldErrors({...fieldErrors, [f.id]: null}), 3000)
                                    }
                                  }}
                                />
                              {fieldErrors[f.id] && <span className="field-error">{fieldErrors[f.id]}</span>}
                              </Form.Label>
                            )}
                            {f.type === 'text' && (
                              <Form.Label>{f.label}
                                <Form.Control
                                  as="textarea"
                                  name={f.id}
                                  value={answers[qs.id]?.groupAnswers?.find(ga => ga.subQuestionId === subQs.id)?.values?.[f.id]?.value ?? ''}
                                  onChange={({ target }) => handleSubQsAnswersChange(s.section_id, qs.id, qs.type, subQs.id, f.id, f.type, target.value)}
                                />
                              </Form.Label>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                   </div>
                  )}
                {/* Management -section */}
                          {/*}
                {qs.type === 'group' &&
                  (qs.id === 'management_corruption_details') &&
                  ( corruption ? (
                  <>
                    {qs.sub_questions.map((mgntSubQs, mgntSubQsIdx) => (
                      <div key={`${mgntSubQs.id}-${mgntSubQsIdx}`} >
                        {mgntSubQs.fields.map((f, fIdx) => (
                          <Form.Label key={`${f.id}-${fIdx}`}>{mgntSubQs.category} {f.label}
                            <Form.Control
                              type="number"
                              name={f.id}
                              value={answers[qs.id]?.groupAnswers?.find(ga => ga.subQuestionId === mgntSubQs.id)?.values?.[f.id]?.value ?? ''}
                              onChange={({ target }) => handleSubQsAnswersChange(s.section_id, qs.id, qs.type, mgntSubQs.id, f.id, f.type, target.value)}
                              onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape',
                                  'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

                                if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey)
                                  return

                                if (!/^[0-9]$/.test(e.key)) {
                                  e.preventDefault()
                                  setFieldErrors({...fieldErrors, [f.id]: 'Vain numerot ovat sallittuja'})
                                  setTimeout(() => setFieldErrors({...fieldErrors, [f.id]: null}), 3000)
                                }
                              }}
                              />
                              {fieldErrors[f.id] && <span className="field-error">{fieldErrors[f.id]}</span>}
                          </Form.Label>
                        ))}
                      </div>
                    ))}
                  </>
                ) : null )
                }
                 </div>
              ))}
              </div>
            ))}
            <Button variant="contained" type="submit">Tallenna</Button>
            <Button variant="outlined" onClick={() => handleClearAnswers()}>Tyhjennä</Button>
        </div>
      ))}
    </Form>
  )
  */
}


export default Comprehensive 
