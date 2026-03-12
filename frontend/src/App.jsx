import { useDispatch, useSelector} from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

import LoginForm from './components/LoginForm';
import NewUserForm from './components/NewUserForm';
import Questions from './components/Questions';
import Answers from './components/Answers';
import Users from './components/Users';
import User from './components/User';

import { initializeUser, clearUser } from './reducers/userReducer';

import Notification from './components/Notification';


const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(initializeUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(clearUser());
  };


  console.log('User:', user); // Debug
  console.log('User role:', user?.role); // Debug

  return (
    <div>
      {!user ? (
        <LoginForm />
      ) : (
        <>
          <nav className="nav-expand-1g bg-light">
            {(user?.role === 'admin' || user?.role === 'viewer') && (
              <Link className="navbar-brand" to="/users">Käyttäjät</Link>
            )}
            <Link className="navbar-brand" to="/">Kysymykset</Link>
            <Link className="navbar-brand" to="/Answers">Vastaukset</Link>
            <Link className="navbar-brand" to={`/users/${user.id}`}>{user.name}</Link>
            <Button onClick={handleLogout}>Kirjaudu ulos</Button>
          </nav>
          <h2>VSME-datakoritit</h2>

          <Routes>
            <Route path="/" element={<Questions />} />
            {(user?.role === 'admin' || user?.role === 'viewer') && (
              <Route path="/users" element={<Users />} />
            )}
            <Route path="/answers" element={<Answers />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>
        </>

      )}
      <Notification />
    </div>
  )
};

export default App;
