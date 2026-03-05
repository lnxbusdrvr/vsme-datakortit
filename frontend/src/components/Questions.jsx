//import { useState, useRef } from 'react';
//import { useDispatch } from 'react-redux';
import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

//import { notify } from '../reducers/notificationReducer';

//import Notification from './Notification';
import Basic from './Basic';
import Comprehensive from './Comprehensive';


const Questions = () => {
  //const dispatch = useDispatch();
  //const navigate = useNavigate();
  const [basicOrComprehensive, setBasicOrComprehensive] = useState(null);

  /*
  useEffect(() => {
  }, []);
  */
  const handleQuestions = async (event) => {
    event.preventDefault();

  };


  return (
    <>
      {basicOrComprehensive === null && (
        <div>Valitse moduuli:</div>
      )}
      <input
        type="radio"
        name="basicOrComprehensive"
        value="basic_module"
        onChange={({ target }) => setBasicOrComprehensive(target.value)}
        required
      />
      <label htmlFor="basic">Perusmoduuli</label>
      <input
        type="radio"
        name="basicOrComprehensive"
        value="comprehensive_module"
        onChange={({ target }) => setBasicOrComprehensive(target.value)}
        required
      />
      <label htmlFor="comprehensive">Kattava moduuli</label>

      {basicOrComprehensive === 'basic_module' && (
        <Basic />
      )}

      {basicOrComprehensive === 'comprehensive_module' && (
        <Comprehensive />
      )}
    </>
  );
};

export default Questions;
