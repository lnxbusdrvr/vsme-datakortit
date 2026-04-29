import { useParams, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Dropdown } from 'react-bootstrap';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

import { updateUser } from '../reducers/usersReducer'
import usersService from '../services/usersService';
import { passwordCheckListRules } from '../utils/formHelpers'

import '../styles.css'

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
  const [passwdEyeIconVisible, setPasswdEyeIconVisible] = useState(false)
  const [newPasswdEyeIconVisible, setNewPasswdEyeIconVisible] = useState(false)
  const [newPasswdConfirmEyeIconVisible, setNewPasswdConfirmEyeIconVisible] = useState(false)


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
  }

  const handleUpdateInfo = async () => {

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
            {loggedUser?.id === id && (
              <Form.Group>
                <Form.Label>Nykyinen salasana</Form.Label>
                <div className="password-div">
                  <Form.Control
                    className="password-input no-border border-0"
                    type={passwdEyeIconVisible ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <div className="password-eye-div p-2" onClick={() => setPasswdEyeIconVisible(!passwdEyeIconVisible)}>
                    {passwdEyeIconVisible
                      ? <EyeOutlined />
                      : <EyeInvisibleOutlined />
                    }
                  </div>
                </div>
              </Form.Group>
            )}
            <Form.Group>
              <Form.Label>Uusi salasana</Form.Label>
              <div className="password-div">
                <Form.Control
                  className="password-input no-border border-0"
                  type={newPasswdEyeIconVisible ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="password-eye-div p-2" onClick={() => setNewPasswdEyeIconVisible(!newPasswdEyeIconVisible)}>
                  {newPasswdEyeIconVisible
                    ? <EyeOutlined />
                    : <EyeInvisibleOutlined />
                  }
                </div>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Vahvista uusi salasana</Form.Label>
              <div className="password-div">
                <Form.Control
                  className="password-input no-border border-0"
                  type={newPasswdConfirmEyeIconVisible ? 'text' : 'password'}
                  value={newPasswordConfirm}
                  onChange={(e) => {
                    setNewPasswordConfirm(e.target.value)
                  }}
                />
                <div className="password-eye-div p-2" onClick={() => setNewPasswdConfirmEyeIconVisible(!newPasswdConfirmEyeIconVisible)}>
                  {newPasswdConfirmEyeIconVisible
                    ? <EyeOutlined />
                    : <EyeInvisibleOutlined />
                  }
                </div>
              </div>
            </Form.Group>
            {passwordCheckListRules(newPassword, newPasswordConfirm)}
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
