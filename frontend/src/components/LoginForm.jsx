import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import { setNotification } from '../reducers/notificationReducer';
//import { setUser } from '../reducers/userReducer';
//import { loginService } from '../services/loginService';
//import storage from '../services/storageService';
//import Notification from './Notification';


const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });
      storage.saveUser(user);
      dispatch(setNotification(`Tervetuloa takaisin,, ${user.name}!`, 5, false))
      dispatch(setUser(user));
      setUsername('');
      setPassword('');
      navigate('/');
    } catch {
      dispatch(setNotification( 'Väärä käyttäjätunnus tai salasana', 5, true ));
    }
  };
  /*
      <Notification />
  */

  /*
  return (
    <>
      <h2>Moi</h2>
    </>
  );
  */

  return (
    <>
      <h2>Kirjaudu</h2>
      <form>
        <div>
          käyttäjänimi
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          salasana
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Kirjaudu</button>
      </form>
    </>
  );
};

export default LoginForm;
