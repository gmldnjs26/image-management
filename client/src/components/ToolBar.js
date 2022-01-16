import React from 'react'
import { Link } from 'react-router-dom'

const ToolBar = () => {
  return (
    <div>
      <Link to="/">
        <span>Home</span>
      </Link>
      <Link to="/auth/register">
        <span style={{ float: 'right' }}>Register</span>
      </Link>
      <Link to="/auth/login">
        <span style={{ float: 'right', marginRight: 8}}>Login</span>
      </Link>
    </div>
  )
}

export default ToolBar