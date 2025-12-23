import { useDispatch, useSelector} from 'react-redux'
//import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import NewUserForm from './components/NewUserForm';
import { clear as clearUser} from './reducers/userReducer';


const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  /*
  useEffect(() => {
  }, []);
  */

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div>
      {!user ? (
        <LoginForm />
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
