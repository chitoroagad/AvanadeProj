"use client";
import styles from './User.module.css'
import React, { useState, useEffect, useContext } from 'react';
import UserName from './UserName'
import { AuthContext } from "../utils/contexts";
import { redirect } from 'next/navigation';

const User = () => {
<<<<<<< HEAD
    const [username, setUsername] = useState("SampleUser");
    useEffect(() => {
        // Logic to fetch the username,
        // For now, using a static value
        // setUsername(fetchedUsername);
      }, []);
=======
    const {isAuth, setIsAuth, username, setUsername} = useContext(AuthContext);
    
    const handleSignOut = () => {
      console.log('logging out');
      localStorage.removeItem('token');
      setIsAuth(false);
      setUsername('');
    }
>>>>>>> 3c2024e (added new frontend + llm development)

  return ( 
    <div>
        <div className={styles.logo}> 
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn m-1">{username}</div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a onClick={handleSignOut}>Sign Out</a></li>
                    </ul>
            </div>
        </div>
        <div className={styles.HelloUser}>
            <UserName username={username} />
        </div>
    </div>
    
  )
}

export default User