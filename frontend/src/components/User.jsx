import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const User = () => {
  const id = useParams().id
  const user = useSelector(({ users }) => users.find( u => u.id === id) )

  console.log(`in User\nuser ${JSON.stringify(user)}`)

  if (!user) {
    return null}

  return (
    <div>
      <h2>user</h2>
      <h3>{user.name}</h3>
    </div>
  )
}

export default User;
