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
    if (questionId === 'management_if_corruption')
      setCorruption(value)

    setAnswers({
      ...answers,
      [questionId]: {
        sectionId,
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
                  <>
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
                  </>
                ) : (
                  <>
                  {qs.type === 'text' && (
                    <Form.Label>{qs.question}
                      <Form.Control
                        as="textarea"
                        name={qs.id}
                        onChange={({ target }) => handleAnswersChange(s.section_id, qs.id, qs.type, target.value)}
                      />
                    </Form.Label>
                  )}
                  {qs.type === 'number' && (
                    <Form.Label>{qs.question}
                      <Form.Control
                        type="number"
                        name={qs.id}
                        onChange={({ target }) => handleAnswersChange(qs.id, target.value)}
                      />
                    </Form.Label>
                  )}
                  {qs.type === 'boolean' && (
                    <>
                      <Form.Label>{qs.question}</Form.Label>
                      <Form.Check
                        label="Kyllä"
                        type="radio"
                        name={qs.id}
                        value="true"
                        onChange={({ target }) => handleAnswersChange(qs.id, target.value)}
                      />
                      <Form.Check
                        label="Ei"
                        type="radio"
                        name={qs.id}
                        value="false"
                        onChange={({ target }) => handleAnswersChange(qs.id, target.value)}
                      />
                    </>
                  )}
                  </>
                )}

              {qs.type === 'group' &&
                  (qs.id !== 'management_if_corruption'
                    && qs.id !== 'management_corruption_details') && (
                <div>
                <p>{qs.question}</p>
                {qs.sub_questions.map((subQs, subQsIdx) => (
                  <div key={`${subQs.id}-${subQsIdx}`} >
                    {subQs.title && (
                      <b>{subQs.title}</b>
                    )}
                    <p>{subQs.category}</p>

                    {subQs.renewable && (
                      <>
                      <Form.Label>{subQs.renewable}
                        <Form.Control type="text" name={subQs.renewable} />
                      </Form.Label>
                      </>
                    )}
                    {subQs.non_renewable && (
                      <Form.Label>{subQs.non_renewable}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.total && (
                      <Form.Label>{subQs.total}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.greenhouse_gas_emission1 && (
                      <Form.Label>{subQs.greenhouse_gas_emission1}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.greenhouse_gas_emission2 && (
                      <Form.Label>{subQs.greenhouse_gas_emission2}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.greenhouse_gas_emission3 && (
                      <Form.Label>{subQs.greenhouse_gas_emission3}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.emission_kg && (
                      <Form.Label>{subQs.emission_kg}
                        <Form.Control type="number" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.emission_release && (
                      <Form.Label>{subQs.emission_release}
                        <Form.Control as="textarea" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.area && (
                      <Form.Label>{subQs.area}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.biological_polymorph && (
                      <Form.Label>{subQs.biological_polymorph}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.breakdown && (
                      <Form.Label>{subQs.breakdown}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.last_year && (
                      <Form.Label>{subQs.last_year}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.reported_year && (
                      <Form.Label>{subQs.reported_year}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.percent_change && (
                      <Form.Label>{subQs.percent_change}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.water_take && (
                      <Form.Label>{subQs.water_take}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.water_used && (
                      <Form.Label>{subQs.water_used}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.all_waste && (
                      <Form.Label>{subQs.all_waste}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.recycled_waste && (
                      <Form.Label>{subQs.recycled_waste}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.recycled_waste_to_energy && (
                      <Form.Label>{subQs.recycled_waste_to_energy}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.destroyable_waste && (
                      <Form.Label>{subQs.destroyable_waste}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {subQs.destroyable_waste && (
                      <Form.Label>{subQs.destroyable_waste}
                        <Form.Control type="text" name={subQs.id} />
                      </Form.Label>
                    )}
                    {qs.id === 'social_responsibility_contract_type' && (
                      <Form.Control type="number" name={subQs.id} />
                    )}
                    {subQs.id === 'health_accidents' && (
                      <Form.Control type="number" name={subQs.id} />
                    )}
                    {subQs.id === 'health_deaths_due_work_related_healty_issues' && (
                      <Form.Control type="number" name={subQs.id} />
                    )}
                    {subQs.id === 'health_training' && (
                      <Form.Control type="number" name={subQs.id} />
                    )}
                  </div>
                ))}
                </div>
              )}
              {/* Management -section */}
              {(qs.type === 'group'
                  && qs.id === 'management_corruption_details')
              && ( corruption ? (
                  <div>
                    <p>{qs.question}</p>
                    {qs.sub_questions.map((mgntSubQs, mgntSubQsIdx) => (
                      <Form.Label key={mgntSubQs.id}>{mgntSubQs.category}
                        <Form.Control
                          type="number"
                          name={mgntSubQs.id}
                          value={answers[mgntSubQs.id] || ''}
                          onChange={({ target }) => handleAnswersChange(mgntSubQs.id, target.value)}
                        />
                      </Form.Label>
                    ))}
                  </div>
                ) : null
              )}
              </div>
              ))}
            </div>
          ))}
          <Button variant="contained" type="submit">Tallenna</Button>
          <Button variant="outlined" onClick={() => handleClearAnswers()}>Tyhjennä</Button>
        </div>
      ))}
    </Form>
  );
}


export default Basic

