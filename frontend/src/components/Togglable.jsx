import { useState } from 'react';

const Togglable = props => {
  const [visible, setVisible] = useState(false)

  const showComponentOnClick = { display: visible ? 'none' : '' }
  const hideComponentOnClick = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  };

  return (
    <div>
      <div style={showComponentOnClick}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={hideComponentOnClick}>
        {props.children}
        <button onClick={toggleVisibility}>peruuta</button>
      </div>
    </div>
  )
};

export default Togglable;
