"use client";
import styles from './User.module.css'
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../utils/contexts';
import { redirect } from '@/node_modules/next/navigation';

const NoHelloUser = () => {
    const { isAuth, setIsAuth, username, setUsername } = useContext(AuthContext);
    useEffect(() => {
      if (!isAuth)
        redirect('/');
    }, [isAuth]);
    
    const handleSignOut = () => {
      console.log('logging out');
      localStorage.removeItem('token');
      setIsAuth(false);
      setUsername('');
    }

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
        
    </div>
    
  )
}

export default NoHelloUser