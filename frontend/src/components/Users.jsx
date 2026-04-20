import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { initializeUsers } from '../reducers/usersReducer';

import Togglable from './Togglable';
import NewUserForm from './NewUserForm';

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)
  const newUserFormRef = useRef();

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  if (!users || users.length === 0)
    return <div>Loading...</div>

  return (
    <div>
      <h2>Käyttäjät</h2>
      {users?.map(u  => (
        <div key={u.id}>
          <Link to={`/users/${u.id}`}>{u.name}</Link>
          {u.role === 'user' && (
            <Link to={`/useranswers/${u.id}`}>Vastatut vastaukset</Link>
          )}
        </div>
      ))}
      <Togglable buttonLabel="Rekisteröi" ref={newUserFormRef} >
        <NewUserForm onUserCreatedToggle={() => newUserFormRef.current.toggleVisibility()} />
      </Togglable>
    </div>
  )
}

export default Users;
