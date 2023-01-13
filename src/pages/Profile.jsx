import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
export default function Profile() {
  const auth = getAuth();
  const [user, setUser] = useState({});
  useEffect(() => {
    setUser(auth.currentUser);
  }, []);
  return (

 
    user?<h1>{user.displayName}</h1>:"No User"
   
  )
}
