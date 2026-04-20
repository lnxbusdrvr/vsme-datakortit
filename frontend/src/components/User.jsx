import { useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Dropdown } from 'react-bootstrap';


import { updateUser } from '../reducers/usersReducer'
import usersService from '../services/usersService';

const User = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const loggedUser = useSelector(state => state.user)
  const [user, setUser] = useState(null)
  const [editingInfo, setEditingInfo] = useState('')
  const [editedInfoValue, setEditedInfoValue] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [fieldError, setFieldError] = useState({})


  useEffect(() => {
    const fetchUser = async () => {
      const userData = await usersService.getUserById(id)
      setUser(userData)
    }
    if (id)
      fetchUser()
  }, [id])

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
    setCurrentPassword('')
    setNewPassword('')
    setNewPasswordConfirm('')
    setFieldError({})
  }

  const handleUpdateInfo = async () => {
    if (editingInfo === 'password') {
      if (newPassword !== newPasswordConfirm) {
        setFieldError({ newPasswordConfirm: 'Salasanat eivät täsmää' })
        return
      }
    }

    const newUserValues = {
      newName: editingInfo === 'name' ? editedInfoValue : user.name,
      newPhone: editingInfo === 'phone' ? editedInfoValue : user.phone,
      newAddress: editingInfo === 'address' ? editedInfoValue : user.address,
      newPostalCode: editingInfo === 'postalCode' ? editedInfoValue : user.postalCode,
      newCity: editingInfo === 'city' ? editedInfoValue : user.city,
      newRole: loggedUser.role === 'admin' && editingInfo === 'role' ? editedInfoValue : user.role,
      currentPassword: editingInfo === 'password' ? currentPassword : '',
      newPassword: editingInfo === 'password' ? newPassword : '',
    }

    await dispatch(updateUser(user.id, newUserValues))
    const userData = await usersService.getUserById(id)
    setUser(userData)

    clearOrCancelEditing()
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
          variant="secondary"
          onClick={() => {clearOrCancelEditing()}}
        >
          Peruuta
        </Button>
      </>
    )
  }

  const editingInfoInputField = (infoToEdit) => {
    return (
      <>
        {loggedUser.role === 'admin' && infoToEdit === 'role' ? (
          <>
            <Dropdown onSelect={(eventKey) => setEditedInfoValue(eventKey)}>
              <label htmlFor="role">Yrityksen muoto</label>
              <Dropdown.Toggle variant="success" id="dropdown-basic" drop="down">
                {editedInfoValue|| 'Valitse käyttäjän rooli'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="user">Käyttäjä</Dropdown.Item>
                <Dropdown.Item eventKey="viewer">Katsoja</Dropdown.Item>
                <Dropdown.Item eventKey="admin">Pääkäyttäjä</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {inputFieldSaveAndCancelButtons()}
          </>
        ) : infoToEdit === 'password' ? (
          <>
            <Form.Group>
              <Form.Label>Nykyinen salasana</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Uusi salasana</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Vahvista uusi salasana</Form.Label>
              <Form.Control
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => {
                  setNewPasswordConfirm(e.target.value)
                  if (fieldError.newPasswordConfirm) setFieldError({})
                }}
              />
              {fieldError.newPasswordConfirm &&
                <span className="field-error">
                  {fieldError.newPasswordConfirm}
                </span>
              }
            </Form.Group>
            {inputFieldSaveAndCancelButtons()}
          </>
        ) : (
          <>
            <Form.Control
              as='textarea'
              value={editedInfoValue}
              onChange={(e) => setEditedInfoValue(e.target.value)}
            />
            {inputFieldSaveAndCancelButtons()}
          </>
        )}
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
      <p>Salasana: <strong>***</strong></p>
      {editingInfo === 'password' ? (
        editingInfoInputField('password')
      ) : (
        <>
        {canModify && (
          canModifyButton('password', '')
        )}
        </>
      )}
      <p>Yhtiön nimi: <strong>{user.companyName}</strong></p>
      <p>Sähköpostiosoite: <strong>{user.email}</strong></p>
      <p>Puhelinnumero: <strong>{user.phone}</strong></p>
      {editingInfo === 'phone' ? (
        editingInfoInputField('phone')
      ) : (
        <>
        {canModify && (
          canModifyButton('phone', user.phone)
        )}
        </>
      )}
      <p>Osoite: <strong>{user.address}</strong></p>
      {editingInfo === 'address' ? (
        editingInfoInputField('address')
      ) : (
        <>
        {canModify && (
          canModifyButton('address', user.address)
        )}
        </>
      )}
      <p>Postinumero: <strong>{user.postalCode}</strong></p>
      {editingInfo === 'postalCode' ? (
        editingInfoInputField('postalCode')
      ) : (
        <>
        {canModify && (
          canModifyButton('postalCode', user.postalCode)
        )}
        </>
      )}
      <p>Kupunki: <strong>{user.city}</strong></p>
      {editingInfo === 'city' ? (
        editingInfoInputField('city')
      ) : (
        <>
        {canModify && (
          canModifyButton('city', user.city)
        )}
        </>
      )}
      <p>Yhtiömuoto: <strong>{user.legalFormOfCompany}</strong></p>
      <p>Y-tunnus: <strong>{user.businessIdentityCode}</strong></p>
      <p>Rooli: <strong>{user.role}</strong></p>
      {editingInfo === 'role' ? (
        editingInfoInputField('role')
      ) : (
        <>
        {loggedUser.role === 'admin' && (
          canModifyButton('role', user.role)
        )}
        </>
      )}
    </div>
  )
}

export default User;
