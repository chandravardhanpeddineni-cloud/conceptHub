import React from 'react'
import { useAuth } from '../hooks';

const Logout = () => {
    const {logout}=useAuth();
    logout();
  return (
    <div></div>
  )
}

export default Logout