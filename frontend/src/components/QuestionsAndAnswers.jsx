//import { useState, useRef } from 'react';
//import { useDispatch } from 'react-redux';
import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

//import { notify } from '../reducers/notificationReducer';

//import Notification from './Notification';
import Basic from './Basic';
import Inclusive from './Inclusive';


const Questions = () => {
  //const dispatch = useDispatch();
  //const navigate = useNavigate();
  const [basicOrInclusive, setBasicOrInclusive] = useState(null);

  /*
  useEffect(() => {
  }, []);
  */
    console.log(`basicOrInclusive: ${basicOrInclusive} `)
  const handleQuestions = async (event) => {
    event.preventDefault();

  };
  /*
      <Notification />
  */

  return (
    <>
      {basicOrInclusive === null && (
        <div>Valitse moduuli:</div>
      )}
      <input
        type="radio"
        name="basicOrInclusive"
        value="basic_module"
        onChange={({ target }) => setBasicOrInclusive(target.value)}
        required
      />
      <label htmlFor="basic">Perusmoduuli</label>
      <input
        type="radio"
        name="basicOrInclusive"
        value="inclusive_module"
        onChange={({ target }) => setBasicOrInclusive(target.value)}
        required
      />
      <label htmlFor="inclusive">Kattava moduuli</label>

      {basicOrInclusive === 'basic_module' && (
        <Basic />
      )}

      {basicOrInclusive === 'inclusive_module' && (
        <Inclusive />
      )}
    </>
  );
};

export default Questions;
