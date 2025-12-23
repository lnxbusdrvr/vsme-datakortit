import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';

import { notify } from '../reducers/notificationReducer';
import { loginUser } from '../reducers/userReducer';

import Notification from './Notification';
import Togglable from './Togglable';
import NewUserForm from './NewUserForm';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      dispatch(loginUser({ email, password }));
      dispatch(notify(`Tervetuloa takaisin,, ${user.name}!`, 5, false))
      setEmail('');
      setPassword('');
      navigate('/');
    } catch {
     dispatch(notify( 'Väärä käyttäjätunnus tai salasana', 5, true ));
    }
  };

  return (
    <>
      <h2>Kirjaudu</h2>
      <Notification />
      <form onSubmit={handleLogin} >
        <div>
          sähköpostiosoite:
          <input
            type="text"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </div>
        <div>
          salasana:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Kirjaudu</button>
      </form>
      <Togglable buttonLabel="Rekisteröi">
        <NewUserForm />
      </Togglable>
    </>
  );
};

export default LoginForm;
