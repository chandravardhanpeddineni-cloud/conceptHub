import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = () => {
    const isAuth=true;
    if(isAuth===false){
        return <Navigate to='/register'/>
    }
  return <Outlet/>
}

export default AuthRoute