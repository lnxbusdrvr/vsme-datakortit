import { useState, useImperativeHandle, forwardRef } from 'react';

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const showComponentOnClick = { display: visible ? 'none' : '' }
  const hideComponentOnClick = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  };

  // make toggleVisibility visible to eg. LoginForm
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  });

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
});

Togglable.displayName = 'Togglable'

export default Togglable;
