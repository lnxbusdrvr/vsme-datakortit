import { useState } from 'react';

import { Form, Button } from 'react-bootstrap';

import Basic from './Basic';
import Comprehensive from './Comprehensive';


const Questions = () => {
  const [basicOrComprehensive, setBasicOrComprehensive] = useState(null);

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
