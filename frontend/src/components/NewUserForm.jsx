import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown, Form, Button } from 'react-bootstrap';
import validator from 'validator';
// Password eye
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'

import { notify } from '../reducers/notificationReducer';
import { createUser } from '../reducers/usersReducer';
import { passwordCheckListRules } from '../utils/formHelpers'

import '../styles.css'

const NewUserForm = ({ onUserCreatedToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwdEyeIconVisible, setPasswdEyeIconVisible] = useState(false)
  const [passwdEyeIconVisibleConfirm, setPasswdEyeIconVisibleConfirm] = useState(false)
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [legalFormOfCompany, setLegalFormOfCompany] = useState('');
  const [businessIdentityCode, setBusinessIdentityCode] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const busIdCodeRegEx = /^[0-9]{7}-[0-9]{1}$/;

    if (!validator.isEmail(email)) {
      dispatch(notify('Sähköposti on virheellinen', 10, true));
      return;
    }
    if (email !== emailConfirm) {
      dispatch(notify('Söhköpostit eivät täsmää', 5, true));
      return;
    }

    if (password !== passwordConfirm) {
      dispatch(notify('Salasanat eivät täsmää', 5, true));
      return;
    }

    if (!busIdCodeRegEx.test(businessIdentityCode)) {
      dispatch(notify('Y-tunnus pitää olla muotoa 1234567-8', 10,  true));
      return;
    }

    const newUser = {
      name,
      email,
      companyName,
      password,
      phone,
      address,
      postalCode,
      city,
      legalFormOfCompany,
      businessIdentityCode,
      role: 'user'
    }

    const isSuccessfullyCreatedUser = await dispatch(createUser(newUser));

    if (isSuccessfullyCreatedUser) {
      setName('');
      setEmail('');
      setEmailConfirm('');
      setCompanyName('');
      setPassword('');
      setPasswordConfirm('');
      setPhone('');
      setAddress('');
      setPostalCode('');
      setCity('');
      setLegalFormOfCompany('');
      setBusinessIdentityCode('');

      onUserCreatedToggle();
    }
  };

  const handlePasswordVisibility = () => {
    if (type === 'password') {
      setIcon(eye)
      setType('text')
    }
    else {
      setType('password')
      setIcon(eyeOff)
    }
  }

  const passwordInputField = () => {
    return (
      <>
        <Form.Label>Salasana</Form.Label>
        <div className="password-div">
          <Form.Control
            className="password-input no-border border-0"
            type={passwdEyeIconVisible ? 'text' : 'password'}
            name="password"
            id="password"
            value={password}
            onChange={
              (e) => setPassword(e.target.value)
            }
          />
          <div className="password-eye-div p-2" onClick={() => setPasswdEyeIconVisible(!passwdEyeIconVisible)}>
            {passwdEyeIconVisible
              ? <EyeOutlined />
              : <EyeInvisibleOutlined />
            }
          </div>
        </div>
        <Form.Label>Salasana uudestaan</Form.Label>
        <div className="password-div">
          <Form.Control
            className="password-input no-border border-0"
            type={passwdEyeIconVisibleConfirm ? 'text' : 'password'}
            name="passwordConfirm"
            id="passwordConfirm"
            value={passwordConfirm}
            onChange={
              (e) => setPasswordConfirm(e.target.value)
            }
            required
          />
          <div className="password-eye-div p-2" onClick={() => setPasswdEyeIconVisibleConfirm(!passwdEyeIconVisibleConfirm)}>
            {passwdEyeIconVisibleConfirm
              ? <EyeOutlined />
              : <EyeInvisibleOutlined />
            }
          </div>
        </div>
        {passwordCheckListRules(password, passwordConfirm)}
      </>
    )
  }

  return (
    <div>
      <h1>Registeröi uusi käyttäjä</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Koko nimi</label>
          <input type="text" name="name" id="name" value={name} onChange={({ target }) => setName(target.value)} required />
        </div>
        <div>
          <label htmlFor="name">Yrityksen nimi</label>
          <input type="text" name="companyName" id="companyName" value={companyName} onChange={({ target }) => setCompanyName(target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Sähköposti</label>
          <input type="text" name="email" id="email" value={email} onChange={({ target }) => setEmail(target.value)} required />
        </div>
        <div>
          <label htmlFor="emailConfirm">Sähköposti uudestaan</label>
          <input type="text" name="emailConfirm" id="emailConfirm" value={emailConfirm} onChange={({ target }) => setEmailConfirm(target.value)} required />
        </div>
        <div>
        {/* Password & password confirm */}
          {passwordInputField()}
        </div>
        <div>
          <label htmlFor="phone">Puhelinnumero</label>
          <input type="text" name="phone" id="phone" value={phone}  onChange={({ target }) => setPhone(target.value)} required />
        </div>
        <div>
          <label htmlFor="address">Yrityksen osoite</label>
          <input type="text" name="address" id="address" value={address} onChange={({ target }) => setAddress(target.value)} required />
        </div>
        <div>
          <label htmlFor="postalCode">Yrityksen postinumero</label>
          <input type="text" name="postalCode" id="postalCode" value={postalCode} onChange={({ target }) => setPostalCode(target.value)} required />
        </div>
        <div>
          <label htmlFor="city">Yrityksen kaupunki</label>
          <input type="text" name="city" id="city" value={city} onChange={({ target }) => setCity(target.value)} required />
        </div>
        <div>
          <Dropdown onSelect={(eventKey) => setLegalFormOfCompany(eventKey)}>
            <label htmlFor="legalFormOfCompany">Yrityksen muoto</label>
            <Dropdown.Toggle variant="success" id="dropdown-basic" drop="down">
              {legalFormOfCompany || 'Valitse yrityksen muoto'}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="Toiminimi">Toiminimi</Dropdown.Item>
              <Dropdown.Item eventKey="Osakeyhtiö">Osakeyhtiö</Dropdown.Item>
              <Dropdown.Item eventKey="Osuuskunta">Osuuskunta</Dropdown.Item>
              <Dropdown.Item eventKey="Avoin yhtiö">Avoin yhtiö</Dropdown.Item>
              <Dropdown.Item eventKey="Kommandiittiyhtiö">Kommandiittiyhtiö</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <label htmlFor="businessIdentityCode">Y-tunnus</label>
          <input type="text" name="businessIdentityCode" id="businessIdentityCode" value={businessIdentityCode} onChange={({ target }) => setBusinessIdentityCode(target.value)} required />
        </div>
        <button type="submit">Luo käyttäjä</button>
      </form>
    </div>
  )
};

export default NewUserForm;
