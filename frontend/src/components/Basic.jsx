import { useDispatch, useSelector} from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

import { initializeBasic } from '../reducers/basicReducer'

const Basic = () => {
  const dispatch = useDispatch()
  const basic = useSelector(state => state.basic)
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(initializeBasic())
  }, [dispatch])

  if (!user || !basic)
    return <div>Loading...</div>

/*
        <div key={b.id || bIdx} >
*/
  return (
    <div>
      {basic.map((b, bIdx) => (
        <div key={b.id || bIdx} >
          <h3>{b.module}</h3>
        {b.sections.map((s, sIdx) => (
          <div key={`${bIdx}-${s.section_id}-${sIdx}`} >
            <h4>{s.title}</h4>
            <p>{s.header}</p>
            {s.questions.map((qs, qsIdx) => (
              <div key={`${bIdx}-${qs.id}-${qs.id}-${qsIdx}`} >
                {qs.id === 'basic_or_incl_module' ? (
                  <>
                    <p>{qs.question}</p>
                    <input type="radio"  value={b.module_id} checked={true} disabled={true} />
                    <label htmlFor={qs.id} >{b.module}</label>
                    <input type="radio" checked={false} disabled={true} />
                    <label>Kattava moduuli</label>
                  </>
                ) : (
                  <label>{qs.question}
                    <input type="text" name={qs.id} />
                  </label>
                )}

              {qs.sub_questions && (
                <div>
                {qs.sub_questions.map((subQs, subQsIdx) => (
                  <div key={`${bIdx}-${qs.id}-${subQs.id}-${subQsIdx}`}>
                    <p>{subQs.category}</p>
                    <label>{subQs.renewable}
                      <input type="text" name={subQs.renewable} />
                    </label>
                    <label>{subQs.non_renewable}
                      <input type="text" name={subQs.non_renewable} />
                    </label>
                    <label>{subQs.total}
                      <input type="text" name={subQs.total} />
                    </label>
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
    </div>
  );
}


export default Basic

