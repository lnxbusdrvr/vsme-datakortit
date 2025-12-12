
const NewUser = () => {
  return (
    <div>
      <h1>Registeröi uusi käyttäjä</h1>
      <form>
        <div>
          <label htmlFor="name">Koko nimi</label>
          <input type="text" name="name" id="name" />
        </div>
        <div>
          <label htmlFor="name">Yrityksen nimi</label>
          <input type="text" name="companyName" id="companyName" />
        </div>
        <div>
          <label htmlFor="email">Sähköposti</label>
          <input type="text" name="email" id="email" />
        </div>
        <div>
          <label htmlFor="password">Salasana</label>
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <label htmlFor="password">Salasana uudestaan</label>
          <input type="password" name="password" id="password" />
        </div>
        <div>
          <label htmlFor="password">Puhelinnumero</label>
          <input type="text" name="phone" id="phone" />
        </div>
        <div>
          <label htmlFor="password">Yrityksen osoite</label>
          <input type="text" name="address" id="address" />
        </div>
        <div>
          <label htmlFor="password">Yrityksen postinumero</label>
          <input type="text" name="postalCode" id="postalCode" />
        </div>
        <div>
          <label htmlFor="password">Yrityksen kaupunki</label>
          <input type="text" name="city" id="city" />
        </div>
        <div>
          <label htmlFor="password">Yrityksen muoto</label>
          <input type="text" name="legalFormOfCompany" id="legalFormOfCompany" />
        </div>
        <div>
          <label htmlFor="password">Y-tunnus</label>
          <input type="text" name="businessIdentityCode" id="businessIdentityCode" />
        </div>
        <div>
          <label htmlFor="password">Y-tunnus</label>
          <input type="text" name="businessIdentityCode" id="businessIdentityCode" />
        </div>
      </form>
      <button type="submit">Luo käyttäjä</button>
    </div>
  )
};

export default NewUser;
