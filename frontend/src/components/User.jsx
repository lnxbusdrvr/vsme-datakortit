import { useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form } from 'react-bootstrap';


import { initializeUsers, updateUser } from '../reducers/usersReducer'
import usersService from '../services/usersService';
import storage from '../services/storageService';

const User = () => {
  const id = useParams().id
  const users = useSelector(state => state.users)
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.user)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingInfo, setEditingInfo] = useState('')
  const [editedInfoValue, setEditedInfoValue] = useState('')
  const [newName, setNewName] = useState('')
  const [newCompanyName, setNewCompanyName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordMatch, setNewPasswordMatch] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newAddress, setNewAddress] = useState('')
  const [newPostalCode, setNewPostalCode] = useState('')
  const [newCity, setNewCity] = useState('')
  const [newLegalFormOfCompany, setNewLegalFormOfCompany] = useState('')
  const [newBusinessIdentityCode, setNewBusinessIdentityCode] = useState('')


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

  const startEditing = (infoToEdit, infoToEditValue) => {
    setEditingInfo(infoToEdit)
    setEditedInfoValue(infoToEditValue)
  }

  const canModifyButton = (infoToEdit, infoToEditValue) => {

    return (
      <Button
        variant="primary"
        onClick={() => startEditing(infoToEdit, infoToEditValue)}
      >
        Muokkaa
      </Button>
    )

  }

  const clearOrCancelEditing = () => {
    setEditingInfo('')
    setEditedInfoValue('')
  }

  const handleUpdateInfo = async () => {

    const newUserValues = {
      newName: newName || user.name,
      newCompanyName: newCompanyName || user.companyName,
      newEmail: newEmail|| user.email,
      newPhone: newPhone|| user.phone,
      newAddress: newAddress|| user.address,
      newPostalCode: newPostalCode|| user.postalCode,
      newCity: newCity|| user.city,
      newLegalFormOfCompany: newLegalFormOfCompany|| user.legalFormOfCompany,
      newBusinessIdentityCode: newBusinessIdentityCode|| user.businessIdentityCode
    }
    if (newPassword)
      newUserValue.newPassword = newPassword

    try {
      await dispatch(updateUser(user.id, newUserValues))
      const userData = await usersService.getUserById(id)
      setUser(userData)

      clearOrCancelEditing()
    }
    catch (error) {
      throw error
    }
  }

  const inputFieldSaveAndCancelButtons = () => {

    return (
      <>
        <Button
          variant="success"
          onClick={() => {handleUpdateInfo()}}
        >
          Tallenna
        </Button>
        <Button
          variant="second"
          onClick={() => {clearOrCancelEditing()}}
        >
          Peruuta
        </Button>
      </>
    )
  }

  const editingInfoInputField = (infoToEdit) => {
    /*
        {fieldError[answerId] && <span className="field-error">{fieldError[answerId]}</span>}
        case '':
          setNew(value)
          break
        case '':
          setNew(value)
          break
     */
    const handleChange = (e) => {
      const value = e.target.value
      setEditedInfoValue(value)

      switch(infoToEdit) {
        case 'name':
          setNewName(value)
          break
        case 'email':
          setNewEmail(value)
          break
      }
    }

    console.log(`infoToEdit ${infoToEdit}`)

    return (
      <>
        <Form.Control
          as='textarea'
          value={editedInfoValue}
          onChange={handleChange}
        />
        {inputFieldSaveAndCancelButtons()}
      </>
    )
  }


  return (
    <div key={`${id}-user-info`} className="user-info">
      <h2>Käyttäjätiedot</h2>
      <p>Nimi: <strong>{user.name}</strong>
      {editingInfo === 'name' ? (
        editingInfoInputField('name')
      ) : (
        <>
        {canModify && (
          canModifyButton('name', user.name)
        )}
        </>
      )}
      </p>
      <p>Sähköpostiosoite: <strong>{user.email}</strong></p>
      {editingInfo === 'email' ? (
        editingInfoInputField('email')
      ) : (
        <>
        {canModify && (
          canModifyButton('email', user.email)
        )}
        </>
      )}
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
