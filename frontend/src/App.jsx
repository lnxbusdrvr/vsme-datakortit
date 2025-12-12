import { useDispatch, useSelector} from 'react-redux'
//import { useEffect } from 'react';
import { Link } from 'react-router-dom';

//import Toggable from './components/Toggable';
import LoginForm from './components/LoginForm';
import NewUserForm from './components/NewUserForm';
import { setUser, clearUser } from './reducers/userReducer';

import storage from './services/storageService';


const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  /*
  useEffect(() => {
    const storageUser = storage.loadUser();
    if (storageUser)
      dispatch(setUser(user));
  }, [dispatch]);
  */

  const handleLogout = () => {
    dispatch(clearUser());
    storage.removeUser();
  };

  return (
    <div>
      {!user ? (
        <LoginForm setUser={setUser} />
      ) : (
        <>
          <nav className="nav-expand-1g bg-light">
            <Link className="navbar-brand" to="/">Kysymykset</Link><Link className="navbar-brand" to="/">Foo</Link> {user.name}<button onClick={handleLogout}>Kirjaudu ulos</button>
          </nav>
        </>
      )}
    </div>
  )
};

export default App;
