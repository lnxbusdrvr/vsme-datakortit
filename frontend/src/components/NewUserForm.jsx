import { useState } from 'react';

import { notify } from '../reducers/notificationReducer';
import usersService from '../services/usersService';

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const busIdCodeRegEx = /^[0-9]{7,}-[0-9]{1,}$/;

    // TODO: Make these work
    if (email !== emailConfirm)
      notify('Sähköpostit eivät täsmää', 5, true);

    if (password !== passwordConfirm)
      notify('Salasanat eivät täsmää', 5, true);

    if (!busIdCodeRegEx.test(businessIdentityCode))
      notify('Y-tunnus pitää olla muotoa 1234567-8', 10,  true);

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
      await usersService.createUser(newUser);
      notify('Käyttäjä luotu onnistuneesti', false, 12000);
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
      notify('Käyttäjän luonti epäonnistui', true, 5000);
    }
  };

  return (
    <div>
      <h1>Registeröi uusi käyttäjä</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Koko nimi</label>
          <input type="text" name="name" value={name} onChange={({ target }) => setName(target.value)} />
        </div>
        <div>
          <label htmlFor="name">Yrityksen nimi</label>
          <input type="text" name="companyName" value={companyName} onChange={({ target }) => setCompanyName(target.value)} />
        </div>
        <div>
          <label htmlFor="email">Sähköposti</label>
          <input type="text" name="email" value={email} onChange={({ target }) => setEmail(target.value)} />
        </div>
        <div>
          <label htmlFor="email">Sähköposti uudestaan</label>
          <input type="text" name="emailConfirm" value={emailConfirm} onChange={({ target }) => setEmailConfirm(target.value)} />
        </div>
        <div>
          <label htmlFor="password">Salasana</label>
          <input type="password" name="password" value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <div>
          <label htmlFor="password">Salasana uudestaan</label>
          <input type="password" name="passwordConfirm" value={passwordConfirm} onChange={({ target }) => setPasswordConfirm(target.value)} />
        </div>
        <div>
          <label htmlFor="phone">Puhelinnumero</label>
          <input type="text" name="phone" value={phone} onChange={({ target }) => setPhone(target.value)} />
        </div>
        <div>
          <label htmlFor="address">Yrityksen osoite</label>
          <input type="text" name="address" value={address} onChange={({ target }) => setAddress(target.value)} />
        </div>
        <div>
          <label htmlFor="postalCode">Yrityksen postinumero</label>
          <input type="text" name="postalCode" value={postalCode} onChange={({ target }) => setPostalCode(target.value)} />
        </div>
        <div>
          <label htmlFor="city">Yrityksen kaupunki</label>
          <input type="text" name="city" value={city} onChange={({ target }) => setCity(target.value)} />
        </div>
        <div>
          <label htmlFor="legalFormOfCompany">Yrityksen muoto</label>
          <input type="text" name="legalFormOfCompany" value={legalFormOfCompany} onChange={({ target }) => setLegalFormOfCompany(target.value)} />
        </div>
        <div>
          <label htmlFor="businessIdentityCode">Y-tunnus</label>
          <input type="text" name="businessIdentityCode" value={businessIdentityCode} onChange={({ target }) => setBusinessIdentityCode(target.value)} />
        </div>
        <button type="submit">Luo käyttäjä</button>
      </form>
    </div>
  )
};

export default NewUser;
