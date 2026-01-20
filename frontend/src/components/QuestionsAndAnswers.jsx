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
  const [basicOrInclusive, setBasicOrInclusive] = useState('');

  /*
  useEffect(() => {
  }, []);
  */
  const handleQuestions = async (event) => {
    event.preventDefault();

    console.log(`send questions\n${basicOrInclusive}`);
  };
  /*
      <Notification />
  */

  return (
    <>
      <h2>Kysmykset</h2>
      <Form onSubmit={handleQuestions} >
        <div>
          <label htmlFor="basic">Perusmoduuli</label>
          <input
            type="radio"
            name="basicOrInclusive"
            value="basic_module"
            onChange={({ target }) => setBasicOrInclusive(target.value)}
            required
          />
          <label htmlFor="inclusive">Kattava moduuli</label>
          <input
            type="radio"
            name="basicOrInclusive"
            value="inclusive_module"
            onChange={({ target }) => setBasicOrInclusive(target.value)}
            required
          />

          {basicOrInclusive === 'inclusive_module' ? (
            <Inclusive />
          ) : (
            <Basic />
          )}
        </div>
        <Button type="submit">Lähetä vastaukset</Button>
      </Form>
    </>
  );
};

export default Questions;
