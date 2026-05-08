import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Form, Button } from 'react-bootstrap'

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
        <button type="submit">Kirjaudu sisään</button>
      </form>
      <Togglable buttonLabel="Rekisteröi" ref={newUserFormRef} >
        <NewUserForm onUserCreatedToggle={() => newUserFormRef.current.toggleVisibility()} />
      </Togglable>
      <p>VSME, ESG Account Oy <sup>&copy;</sup> {new Date().getFullYear()}</p>
    </>
  )
}

export default LoginForm
