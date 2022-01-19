import React, { useState, useContext } from 'react'
import CustomInput from '../components/CustomInput'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [, setMe] = useContext(AuthContext)

  const navigate = useNavigate()

  const loginHandler = async (e) => {
    try {
      e.preventDefault()
      const result = await axios.patch('http://localhost:5555/users/login', { username, password })
      setMe({ 
        userId: result.data.userId,
        sessionId: result.data.sessionId,
        name: result.data.name
      })
      toast.success('login success')
      navigate('/')
    } catch(err) {
      console.error(err)
      toast.error(err.response.data.message)
    }
    
  }

  return (
    <div style={{
      marginTop: 100,
      maxWidth: 350,
      marginRight: 'auto',
      marginLeft: 'auto',
    }}>
      <h3>로그인</h3>
      <form onSubmit={loginHandler}>
        <CustomInput label="Username" value={username} setValue={setUsername} />
        <CustomInput type="password" label="password" value={password} setValue={setPassword} />
        <button style={{ width: 100}} type="submit">Submit</button>
      </form>

    </div>
  )
}

export default LoginPage