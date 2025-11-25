import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = (props) => {
  const isAuth = false;
  if (isAuth===false) return <Navigate to="/" />;
  return <Outlet />;
};

export default GuestRoute;
