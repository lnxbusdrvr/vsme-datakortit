import { useDispatch, useSelector} from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

import LoginForm from './components/LoginForm';
import NewUserForm from './components/NewUserForm';
import Questions from './components/Questions';
import Answers from './components/Answers';
import User from './components/User';

import { initUser, clear as clearUser } from './reducers/userReducer';
import { initializeUsers } from './reducers/usersReducer';


const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initUser());
  }, [dispatch]);

  useEffect(() => {
    if (user)
      dispatch(initializeUsers());
  }, [dispatch, user]);


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
             <Link className="navbar-brand" to="/">Kysymykset</Link> <Link className="navbar-brand" to="/Answers">Vastatut vastaukset</Link> <Link className="navbar-brand" to={`/users/${user.id}`}>{user.name}</Link> <Button onClick={handleLogout}>Kirjaudu ulos</Button>
          </nav>
          <h2>vsme-datakoritit</h2>

          <Routes>
            <Route path="/" element={<Questions />} />
            <Route path="/Answers" element={<Answers />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>
        </>
      )}
    </div>
  )
};

export default App;
