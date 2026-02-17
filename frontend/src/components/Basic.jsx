import { useState, useEffect } from 'react';
import { useDispatch, useSelector} from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

import { initializeBasic } from '../reducers/basicReducer'
import { addAnswer } from '../reducers/answersReducer';

import '../styles.css'

const Basic = () => {
  const dispatch = useDispatch()
  const basic = useSelector(state => state.basic)
  const user = useSelector(state => state.user)
  const [answers, setAnswers] = useState({})
  const [corruption, setCorruption] = useState(false)
  const [moduleId, setModuleId] = useState(false)

  useEffect(() => {
    dispatch(initializeBasic())
  }, [dispatch])

  useEffect(() => {
    if (basic && basic.length > 0)
      setModuleId(basic[0].module_id)
  }, [basic])

  if (!user || !basic)
    return <div>Loading...</div>

  const handleAnswersChange = (sectionId, questionId, type, value) => {
    console.log(`handleAnswersChange:\n\tsectionId: ${sectionId}\n\tquestionId: ${questionId}\n\tvalue: ${value}`)
    if (questionId === 'management_if_corruption')
      setCorruption(value)
    /*
     * TODO:
     * only one handler for all questions
     ************************************/

    setAnswers({
      ...answers,
      [questionId]: {
        sectionId,
        type,
        answer: value
      }
    })
  }

  const handleSubQsAnswersChange = (sectionId, questionId, fieldKey, type, value) => {
    console.log(`handleSubQuestionAnswersChange:\n\tsectionId: ${sectionId}\n\tquestionId: ${questionId}\n\tsubQuestionId: ${subQuestionId}\n\tvalue: ${value}`)

    setAnswers({
      ...answers,
      [fieldKey]: {
        sectionId,
        questionId,
        type,
        answer: value
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    console.log('All answers:', answers)

    try {
      for (const [questionId, data] of Object.entries(answers)) {
        const payload = {
          moduleId,
          sectionId: data.sectionId,
          questionId,
          type: data.type || 'text',
          answer: data.answer
        }
        console.log('Sending answer:', payload)
        await dispatch(addAnswer(payload))
      }
    } catch (error) {
      console.log('Error submitting answers:', error)
    }


  }

  const handleClearAnswers = () => {
    setAnswers({})
    setCorruption(false)
  }


      console.log(`answers: ${JSON.stringify(answers)}\ncorruption: ${corruption}`)
console.log('corruption state:', corruption, 'type:', typeof corruption)
  return (
    <Form onSubmit={handleSubmit}>
      <p>
        Tämä raportti on laadittu VSME 17.12.2024 mukaisesti:
        <a href="https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf" target="_blank">https://www.efrag.org/sites/default/files/sites/webpublishing/SiteAssets/VSME%20Standard.pdf</a>
      </p>

      {basic.map((b, bIdx) => (
        <div key={b.id || bIdx} >
          <h1>{b.module}</h1>
          {b.sections.map((s, sIdx) => (
            <div key={`${s.section_id}-${sIdx}`} >
              {s.header && <h2>{s.header}</h2>}
              <p className="title-box">{s.title}</p>

              {s.questions.map((qs, qsIdx) => (
                <div key={`${qs.id}-${qsIdx}`} >
                  {qs.id === 'basic_or_incl_module' ? (
                    <div key="basic_or_incl_module">
                      <p>{qs.question}</p>
                      <Form.Check
                        type="radio"
                        label="Perusmoduuli"
                        value={b.module_id}
                        checked={true}
                        disabled
                      />
                      <Form.Check
                        type="radio"
                        label="Kattava moduuli"
                        checked={false}
                        disabled
                      />
                    </div>
                  ) : (
                    <div key="other_questions">
                      {qs.type === 'text' && (
                        <Form.Label>{qs.question}
                          {/* value's value is needed to get clear button to work */}
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
                          <Form.Control
                            type="number"
                            name={qs.id}
                            value={answers[qs.id]?.answer || ''}
                            onChange={({ target }) => handleAnswersChange(s.section_id, qs.id, qs.type, target.value)}
                          />
                        </Form.Label>
                      )}
                      {qs.type === 'boolean' && (
                        <>
                          {/* checked's value is needed to get clear button to work */}
                          <Form.Label>{qs.question}</Form.Label>
                          <Form.Check
                            label="Kyllä"
                            type="radio"
                            name={qs.id}
                            checked={answers[qs.id]?.answer === true}
                            onChange={({ target }) => handleAnswersChange(s.section_id, qs.id, qs.type, true)}
                          />
                          <Form.Check
                            label="Ei"
                            type="radio"
                            name={qs.id}
                            checked={answers[qs.id]?.answer === false}
                            onChange={({ target }) => handleAnswersChange(s.section_id, qs.id, qs.type, true)}
                          />
                        </>
                      )}
                  </div>
                )}
                {qs.type === 'group' &&
                    (qs.id !== 'management_if_corruption' &&
                      qs.id !== 'management_corruption_details') && (
                  <div key={`${qs.id}-${qsIdx}`} >
                    <p>{qs.question}</p>
                    {qs.sub_questions.map((subQs, subQsIdx) => (
                      <div key={`${subQs.id}-${subQsIdx}`} >
                        {subQs.title && (
                          <b>{subQs.title}</b>
                        )}
                        <p>{subQs.category}</p>
                        {subQs.fields.map((f, fIdx) => (
                          <div key={`${f.key}-${fIdx}`} >
                            {f.type === 'number' && (
                              <Form.Label>{f.label}
                                <Form.Control
                                  type="number"
                                  name={f.id}
                                  value={answers[f.id]?.answer || ''}
                                  onChange={({ target }) => handleSubQsAnswersChange(s.section_id, qs.id, subQs.id, target.value)}
                                />
                              </Form.Label>
                            )}
                            {f.type === 'text' && (
                              <Form.Label>{f.label}
                                <Form.Control
                                  as="textarea"
                                  name={f.id}
                                  value={answers[f.id]?.answer || ''}
                                  onChange={({ target }) => handleSubQsAnswersChange(s.section_id, qs.id, subQs.id, target.value)}
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
                {qs.type === 'group' &&
                  (qs.id === 'management_corruption_details') &&
                  ( corruption ? (
                  <>
                    {qs.sub_questions.map((mgntSubQs, mgntSubQsIdx) => (
                      <div key={`${mgntSubQs.id}-${mgntSubQsIdx}`} >
                        {mgntSubQs.fields.map((f, fIdx) => (
                          <Form.Label key={`${f.key}-${fIdx}`}>{mgntSubQs.category} {f.label}
                            <Form.Control
                              type="number"
                              name={f.key}
                              value={answers[f.key]?.answer || ''}
                              onChange={({ target }) => handleSubQsAnswersChange(s.section_id, qs.id, f.key, f.type, target.value)}
                              />
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
}



export default Basic

