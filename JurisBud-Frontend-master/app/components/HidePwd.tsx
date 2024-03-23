"use client";
import React, { useState } from 'react';
import styles from './HidePwd.module.css';
import Image from "next/image";

const HidePwd = (props) => {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <>
            <input 
                type={passwordShown ? "text" : "password"}
                id="passwordField"
                placeholder='Password'
                className={styles.Input}
                {...props}
            />
            <Image 
                src={passwordShown ? '/signup/eyeOpen.png' : '/signup/eyeClose.png'} 
                onClick={togglePasswordVisibility}
                width={0} height={0} sizes="100vw"
                style={{ cursor: 'pointer' }}
                className={styles.EyeIcon}
                alt='finish'
            />
        </>
    );
};

export default HidePwd;
