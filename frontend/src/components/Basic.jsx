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
                <p>{qs.question}</p>
              {qs.sub_questions && (
                <div>
                {qs.sub_questions.map((subQs, subQsIdx) => (
                  <div key={`${bIdx}-${qs.id}-${subQs.id}-${subQsIdx}`}>
                    <p>{subQs.category}</p>
                    <p>{subQs.renewable}</p>
                    <p>{subQs.non_renewable}</p>
                    <p>{subQs.total}</p>
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

