"use client";

import React, { useState } from 'react';
import styles from './CreateAccountBtn.module.css';
import CreateAccountModal from '../components/CreateAccountModal';
import Link from 'next/link';

export default function CreateAccountBtn(props) {

    const {showModal, ...btnProps} = props;
    return(
    <div className={styles.SignUpBtn}>
        <button className='btn btn-wide btn-primary'>Create Account</button>
        <CreateAccountModal show={showModal}>
            <p className={styles.Success}>Success!</p>
            <br></br>
            <Link href="/">
                <button className='btn btn-wide  btn-outline btn-secondary' {...btnProps}>Login</button>
            </Link>
        </CreateAccountModal>
    </div>

    );
}