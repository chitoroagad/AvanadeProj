"use client";
import styles from './User.module.css'
import React, { useState, useEffect } from 'react';
import UserName from './UserName'

const User = () => {
    const [username, setUsername] = useState("SampleUser");
    useEffect(() => {
        // Logic to fetch the username,
        // for example, from an API or user context
        // For now, using a static value
        // setUsername(fetchedUsername);
      }, []);

  return ( 
    <div>
        <div className={styles.logo}> 
            <div className="dropdown">
                <div tabIndex={0} role="button" className="btn m-1">{username}</div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a>Sign Out</a></li>
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