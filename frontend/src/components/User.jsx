import { useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap';


import { initializeUsers } from '../reducers/usersReducer'
import usersService from '../services/usersService';
import storage from '../services/storageService';

const User = () => {
  const id = useParams().id
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.user)
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

  const canModify = (user?.id === id
    || loggedUser?.id === id
    || loggedUser?.role === 'admin')
    && loggedUser?.role !== 'viewer'


  const handleUpdateInfo= () => {
    console.log(`handleUpdateInfo`)
  }

  return (
    <div key={`${id}-user-info`} className="user-info">
      <h2>Käyttäjätiedot</h2>
      <p>Nimi: <strong>{user.name}</strong>
        {canModify && (
          <Button variant="primary" onClick={() => handleUpdateInfo()}>
            Muokkaa tietoa
          </Button>
        )}
      </p>
      <p>Sähköpostiosoite: <strong>{user.email}</strong></p>
      <p>Yhtiön nimi: <strong>{user.companyName}</strong></p>
      <p>Puhelinnumero: <strong>{user.phone}</strong></p>
      <p>Osoite: <strong>{user.address}</strong></p>
      <p>Postinumero: <strong>{user.postalCode}</strong></p>
      <p>Kupunki: <strong>{user.city}</strong></p>
      <p>Yhtiömuoto: <strong>{user.legalFormOfCompany}</strong></p>
      <p>Y-tunnus: <strong>{user.businessIdentityCode}</strong></p>
      <p>Rooli: <strong>{user.role}</strong></p>
    </div>
  )
}

export default User;
