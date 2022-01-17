import React, { useState, useContext } from 'react'
import CustomInput from '../components/CustomInput'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const RegisterPage = () => {
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordCheck, setPasswordCheck] = useState("")
  const [me, setMe] = useContext(AuthContext)

  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      if(username.length < 3) throw new Error("Please Longer Id")
      if(password.length < 6) throw new Error("Please Longer Password")
      if(password !== passwordCheck) throw new Error("Password and PasswordCheck is different")
      const result = await axios.post('http://localhost:5555/users/register', { name, username, password })
      setMe({ 
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name
      })
      toast.success('register success')
    } catch(err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  return (
    <div style={{
      marginTop: 100,
      maxWidth: 350,
      marginRight: 'auto',
      marginLeft: 'auto',
    }}>
      <h3>회원가입</h3>
      <form onSubmit={submitHandler}>
        <div>
          <CustomInput label="Name" value={name} setValue={setName} />
          <CustomInput label="Username" value={username} setValue={setUsername} />
          <CustomInput type="password" label="password" value={password} setValue={setPassword} />
          <CustomInput type="password" label="passwordCheck" value={passwordCheck} setValue={setPasswordCheck} />
        </div>
        <button style={{ width: 100}} type="submit">Submit</button>
      </form>
    </div>
  )
}

export default RegisterPage