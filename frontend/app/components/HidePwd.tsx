"use client";
import React, { useState } from 'react';
import styles from './HidePwd.module.css';

const HidePwd = () => {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="password-container">
            <input 
                type={passwordShown ? "text" : "password"}
                id="passwordField"
                // add other necessary props like onChange, value, etc.
                placeholder='Password'
                className={styles.Input}
            />
            <img 
                src={passwordShown ? '/signup/eyeOpen.png' : '/signup/eyeClose.png'} 
                onClick={togglePasswordVisibility}
                style={{ cursor: 'pointer' }}
                className={styles.EyeIcon}
            />
        </div>
    );
};

export default HidePwd;
