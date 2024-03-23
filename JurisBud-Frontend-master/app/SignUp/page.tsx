'use client'

import Link from "next/link";
import styles from "./SignUp.module.css";
import Logo from "../components/Logo";
import HidePwd from "../components/HidePwd";
import CreateAccountBtn from "../components/CreateAccountBtn";
import Image from "next/image"
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../utils/contexts";
import {apiClient} from '../utils/api';
import { redirect } from "next/navigation";

const default_errors = {
  password: '',
  email: '',
  name: '',
}

export default function SignUp() {
  const {isAuth, setIsAuth, username, setUsername} = useContext(AuthContext);
  const [errors, setErrors] = useState({...default_errors});
  const [showModal, setShowModal] = useState(false);
  const handleSignUp = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    console.log("formdata:", formData);
    try{
      const response = await apiClient.post('/signup', {body: JSON.stringify(Object.fromEntries(formData))});
      const data = await response.json();
      console.log('Signup')
      if (!response.ok)
      {
        console.log('Signup failed:', response);
        setErrors({
          password: data?.password && data.password[0] || '',
          email: data?.email && data.email[0] || '',
          name: data?.name && data.name[0] || ''
        });
      }
      else
      {
        setShowModal(true);
        // localStorage.setItem('token', data.token);
        // setUsername(data.user.name);
        // setErrors({...default_errors});
        // setIsAuth(true);
        // redirect('/Home');

      }
    }
    catch (err)
    {
      console.log(err);
      setErrors((prev) => ({...prev, password: 'Something went wrong.'}));
    }
  }

  useEffect(() => {
    if (isAuth)
      redirect('/Home');
  }, [isAuth]);
  return (
    <main>
        <div className={styles.SignUp}>
          <div>
            <h1 className={styles.SignUpTitle}>Welcome!</h1>
          </div>
          <div className={styles.Box}>
            <div>
              <h2 className={styles.SignUpSubtitle}>Create Account</h2>
            </div>
            <div className={styles.SignUp3rd}>
                <div className={styles.GoogleSignUp}>
                    <Image width={0} height={0} sizes="100vw" src='/signup/Google.png' className={styles.GoogleIcon} alt='google' />
                    <p>Sign Up with Google</p>
                </div>
                <div className={styles.FacebookSignUp}>
                    <Image width={0} height={0} sizes="100vw" src='/signup/Facebook.png' className={styles.FacebookIcon} alt='facebook' />
                    <p>Sign Up with Facebook</p>
                </div>
            </div>
            <div className={styles.Or}>
                <p>-OR-</p>
            </div>
            <form method="POST" onSubmit={handleSignUp}>
            <div className={styles.SignUpInfo}>
                <input type="text" name="name" className={styles.Input} placeholder="Full Name"></input><br></br>
                {
                errors?.name && <span className='ml-01my-2 text-error'>{errors.name}</span>
                }
                <input type="text" name="email" className={styles.Input} placeholder="Email"></input><br></br>
                {
                errors?.email && <span className='ml-1 my-2 text-error'>{errors.email}</span>
                }
                <HidePwd name="password"></HidePwd>
                {
                errors?.password && <span className='ml-1 text-error' style={{marginBottom: '-10px'}}>{errors.password}</span>
                }
            </div>
            <div className={styles.SignUpBtn}>
              <CreateAccountBtn showModal={showModal} type="submit" />
            </div>
            </form>
            <div className={styles.Login}>
              <p>Already an account?</p>
              <div className={styles.LoginText}>
                <Link href="/">
                <p>Log in</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Image width={0} height={0} sizes="100vw" src='/start/startpic.png' className={styles.SignUpPic} alt='sign up' />
        <Image width={0} height={0} sizes="100vw" src='/start/background1.png' className={styles.SignUpBackground} alt='sign up background' />
        <div className={styles.Logo}><Logo></Logo></div>
    </main>
  );
}

