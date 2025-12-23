import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import validator from 'validator';

import { notify } from '../reducers/notificationReducer';
import { createUser } from '../reducers/usersReducer';

const NewUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [legalFormOfCompany, setLegalFormOfCompany] = useState('');
  const [businessIdentityCode, setBusinessIdentityCode] = useState('');

  const dispatch = useDispatch();
  const allUsers = useSelector(state => state.users);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const busIdCodeRegEx = /^\d{7}-\d{1}$/;

    const emailIsDuplicated = allUsers.some(user => user.email === email)
    if (emailIsDuplicated) {
      dispatch(notify('Sähköposti on jo käytössä', 5, true));
      return;
    }

    const busIdCodeIsDuplicated = allUsers
      .some(user => user.businessIdentityCode === businessIdentityCode)
    if (busIdCodeIsDuplicated) {
      dispatch(notify('Y-tunnus on jo käytössä', 5, true));
      return;
    }

    if (!validator.isEmail(email)) {
      dispatch(notify('Sähköposti on virheellinen', 10, true));
      return;
    }

    if (email !== emailConfirm) {
      dispatch(notify('Sähköpostit eivät täsmää', 5, true));
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

    try {
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
      dispatch(createUser(newUser));
      dispatch(notify('Käyttäjä luotu onnistuneesti', 12000, false ));
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
    } catch {
      dispatch(notify('Käyttäjän luonti epäonnistui', true, 5000));
    }
  };

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
          <label htmlFor="password">Salasana</label>
          <input type="password" name="password" id="" value={password} onChange={({ target }) => setPassword(target.value)} required />
        </div>
        <div>
          <label htmlFor="passwordConfirmed">Salasana uudestaan</label>
          <input type="password" name="passwordConfirm" id="passwordConfirm" value={passwordConfirm} onChange={({ target }) => setPasswordConfirm(target.value)} required />
        </div>
        <div>
          <label htmlFor="phone">Puhelinnumero</label>
          <input type="text" name="phone" id="phone" value={phone}  onChange={({ target }) => setPhone(target.value)} />
        </div>
        <div>
          <label htmlFor="address">Yrityksen osoite</label>
          <input type="text" name="address" id="address" value={address} onChange={({ target }) => setAddress(target.value)} />
        </div>
        <div>
          <label htmlFor="postalCode">Yrityksen postinumero</label>
          <input type="text" name="postalCode" id="postalCode" value={postalCode} onChange={({ target }) => setPostalCode(target.value)} />
        </div>
        <div>
          <label htmlFor="city">Yrityksen kaupunki</label>
          <input type="text" name="city" id="city" value={city} onChange={({ target }) => setCity(target.value)} />
        </div>
        <div>
          <label htmlFor="legalFormOfCompany">Yrityksen muoto</label>
          <input type="text" name="legalFormOfCompany" id="legalFormOfCompany" value={legalFormOfCompany} onChange={({ target }) => setLegalFormOfCompany(target.value)} />
        </div>
        <div>
          <label htmlFor="businessIdentityCode">Y-tunnus</label>
          <input type="text" name="businessIdentityCode" id="businessIdentityCode" value={businessIdentityCode} onChange={({ target }) => setBusinessIdentityCode(target.value)} />
        </div>
        <button type="submit">Luo käyttäjä</button>
      </form>
    </div>
  )
};

export default NewUser;
