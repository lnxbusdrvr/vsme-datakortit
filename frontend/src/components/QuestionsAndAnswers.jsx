//import { useState, useRef } from 'react';
//import { useDispatch } from 'react-redux';
//import { useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

//import { notify } from '../reducers/notificationReducer';

//import Notification from './Notification';


const Questions = () => {
  //const dispatch = useDispatch();
  //const navigate = useNavigate();

  /*
  useEffect(() => {
  }, []);
  */
  const handleQuestions = async (event) => {
    event.preventDefault();

    console.log('send questions')
  };
  /*
      <Notification />
  */

  return (
    <>
      <h2>Kysmykset</h2>
      <Form onSubmit={handleQuestions} >
        <div>
         Perusmoduuli vai kattava moduuli 
          <input
            type="text"
            value="some teksti"
          />
        </div>
        <Button type="submit">Lähetä vastaukset</Button>
      </Form>
    </>
  );
};

export default Questions;
