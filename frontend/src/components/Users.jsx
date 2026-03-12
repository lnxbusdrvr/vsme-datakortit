import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'


import usersService from '../services/usersService';

const Users = () => {
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  if (!users || users.length === 0)
    return <div>Loading...</div>

  return (
    <div>
      <h2>Käyttäjät</h2>
      {users.map(u  => (
        <div key={u.id}>
          <Link to={`/users/${u.id}`}>{u.name}</Link>
          <h3>{u.email}</h3>
        </div>
      ))}
    </div>
  )
}

export default Users;
