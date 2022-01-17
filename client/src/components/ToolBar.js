import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ToolBar = () => {
  const [me, setMe] = useContext(AuthContext)
  const logoutHandler = async () => {
    try {
      const result = await axios.patch("http://localhost:5555/users/logout")
      setMe(null)
      toast.success(result.data.message)
    } catch(err) {
      console.error(err)
      toast.error(err.message)
    }
  }
  return (
    <div>
      <Link to="/">
        <span>Home</span>
      </Link>
      {me ? (
        <span onClick={logoutHandler} style={{ float: 'right', cursor:'pointer'}}>Logout</span>
      ) : (
        <>
          <Link to="/auth/register">
            <span style={{ float: 'right' }}>Register</span>
          </Link>
          <Link to="/auth/login">
            <span style={{ float: 'right', marginRight: 8}}>Login</span>
          </Link>
        </>
      )}
    </div>
  )
}

export default ToolBar