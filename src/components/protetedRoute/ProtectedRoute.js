import React from 'react';
import { Navigate, Route } from "react-router-dom";


const ProtectedRouteElement = ({ element: Component, ...props}) => {
  return (
    props.loggedIn ? Component : console.log('<Navigate to="/login" replace/>')
)}

export default ProtectedRouteElement; 