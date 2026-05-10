import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { useEffect } from 'react'

import LoginForm from './components/LoginForm'
import Questions from './components/Questions'
import Answers from './components/Answers'
import Users from './components/Users'
import User from './components/User'

import { initializeUser, clearUser } from './reducers/userReducer'

import Notification from './components/Notification'


const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogout = () => {
    dispatch(clearUser())
  }


  return (
    <div key="app-div" className="app container">
      {!user ? (
        <LoginForm />
      ) : (
        <>
          <nav className="nav-expand-1g mt-4 mb-4 p-2 ">
            {(user?.role === 'admin' || user?.role === 'viewer') && (
              <Link to="/users">Käyttäjät</Link>
            )}
            {(user?.role === 'user') && (
              <>
                <Link to="/">Kysymykset</Link>
                <Link className="ms-2" to={`/useranswers/${user.id}`}>Vastaukset</Link>
              </>
            )}
            <Link className="ms-2" to={`/users/${user.id}`}>{user.name}</Link>
            <Link className="ms-2" onClick={handleLogout}>Kirjaudu ulos</Link>
          </nav>
          <h2>VSME-datakoritit</h2>

          <Routes>
            <Route path="/" element={<Questions />} />
            {(user?.role === 'admin' || user?.role === 'viewer') && (
              <Route path="/users" element={<Users />} />
            )}
            <Route path="/useranswers/:id" element={<Answers />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>
        </>

      )}
      <Notification />
    </div>
  )
}

export default App
