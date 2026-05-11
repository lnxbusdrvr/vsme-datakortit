import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Form, Button } from 'react-bootstrap'

// Log in icon
import { FaRightToBracket } from 'react-icons/fa6'

import { loginUser } from '../reducers/userReducer'

import Notification from './Notification'
import Togglable from './Togglable'
import NewUserForm from './NewUserForm'


const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const newUserFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    await dispatch(loginUser({ email, password }))
    setEmail('')
    setPassword('')
    navigate('/')
  }

  return (
    <>
      <h2>VSME Raportointi - ESG Account Oy</h2>
      <p>Kirjautuminen sivulle:</p>
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
        <button type="submit">Kirjaudu sisään<FaRightToBracket className="ms-2" /></button>
      </form>
      <Togglable buttonLabel="Rekisteröi" ref={newUserFormRef} >
        <NewUserForm onUserCreatedToggle={() => newUserFormRef.current.toggleVisibility()} />
      </Togglable>
    </>
  )
}

export default LoginForm
