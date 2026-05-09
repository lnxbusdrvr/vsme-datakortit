import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Dropdown } from 'react-bootstrap'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

import { updateUser, deleteUser } from '../reducers/usersReducer'
import { clearUser } from '../reducers/userReducer'
import usersService from '../services/usersService'
import { passwordCheckListRules } from '../utils/formHelpers'

import '../styles.css'

const User = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
  const [verifiedUserDeleteConfirmText, setVerifiedUserDeleteConfirmText] = useState('')
  const [fieldError, setFieldError] = useState()


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

  // Only user itself or admin can modify user info
  const canModify = (user?.id === id && loggedUser?.id === id)
    || loggedUser?.role === 'admin'

  const handleDeleteUser = () => {
    if (verifiedUserDeleteConfirmText !== 'delete') {
      setFieldError('Vahvistusteksti ei täsmää')
      setTimeout(() => setFieldError(''), 3000)
      return
    }

    clearOrCancelEditing()
    dispatch(deleteUser(id))
    if (loggedUser?.role === 'admin') {
      navigate('/users')
      return
    }
    dispatch(clearUser())
  }

  const startEditing = (infoToEdit, infoToEditValue) => {
    setEditingInfo(infoToEdit)
    setEditedInfoValue(infoToEditValue)
  }

  const canModifyButton = (infoToEdit, infoToEditValue) => {
    const userDelete = infoToEdit === 'delete-user'

    return (

      <Button
        {...(!userDelete ? { variant:'primary' } : { variant: 'danger' })}
        onClick={() => startEditing(infoToEdit, infoToEditValue)}
      >
        {!userDelete ? 'Muokkaa' : 'Poista käyttäjä'}
      </Button>
    )

  }

  const clearOrCancelEditing = () => {
    setEditingInfo('')
    setEditedInfoValue('')
    setCurrentPassword('')
    setNewPassword('')
    setNewPasswordConfirm('')
    setVerifiedUserDeleteConfirmText('')
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
      newPassword: editingInfo === 'password' ? newPassword : ''
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
    if (infoToEdit === 'delete-user') {
      return (
        <div if="delete-user-confirmation">
          <Form.Group>
            <Form.Label>Vahvista kirjoittamalla <strong>delete</strong></Form.Label>
            <Form.Control
              as='textarea'
              value={verifiedUserDeleteConfirmText}
              onChange={(e) => setVerifiedUserDeleteConfirmText(e.target.value)}
            />
            {fieldError &&
              <span className="field-error">
                {fieldError}
              </span>
            }
          </Form.Group>
          <Button
            variant="danger"
            onClick={() => {handleDeleteUser()}}
          >
            Poista käyttäjä
          </Button>
          <Button
            variant="secondary"
            onClick={() => {clearOrCancelEditing()}}
          >
            Peruuta
          </Button>
        </div>
      )
    }

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
      {/* Owner and admin can delete owners account */}
      {/* except admin can't delete it's own account */}
      <div id="delete-user-div">
        {editingInfo === 'delete-user' ? (
          editingInfoInputField('delete-user')
        ) : (
          <>
            {(user?.id === loggedUser?.id && loggedUser?.role !== 'admin')
              || (user?.id !== loggedUser?.id && loggedUser?.role === 'admin')
              && (
                canModifyButton('delete-user', id)
            )}
          </>
        )}
      </div>
    </div>
  )
}


export default User
