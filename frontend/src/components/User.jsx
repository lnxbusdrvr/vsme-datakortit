import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'

import usersService from '../services/usersService';

const User = () => {
  const id = useParams().id
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await usersService.getUserById(id)
        setUser(userData)
      } catch (error) {
        console.log('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id)
      fetchUser()
  }, [id])

  if (loading)
    return <div>Loading...</div>

  if (!user)
    return <div>User not found</div>


  return (
    <div>
      <h2>user</h2>
      <h3>{user.name}</h3>
      <h3>{user.role}</h3>
      <h3>{user.companyName}</h3>

    </div>
  )
}

export default User;
