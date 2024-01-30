import Link from "next/link";
import styles from "./SignUp.module.css";
import Logo from "../components/Logo";
import HidePwd from "../components/HidePwd";
import CreateAccountBtn from "../components/CreateAccountBtn";

export default function SignUp() {
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
                    <img src='/signup/Google.png' className={styles.GoogleIcon}></img>
                    <p>Sign Up with Google</p>
                </div>
                <div className={styles.FacebookSignUp}>
                    <img src='/signup/Facebook.png' className={styles.FacebookIcon}></img>
                    <p>Sign Up with Facebook</p>
                </div>
            </div>
            <div className={styles.Or}>
                <p>-OR-</p>
            </div>
            <div className={styles.SignUpInfo}>
                <input type="text" className={styles.Input} placeholder="Full Name"></input><br></br>
                <input type="text" className={styles.Input} placeholder="Email"></input><br></br>
                <HidePwd></HidePwd>

                
            </div>
            <div className={styles.SignUpBtn}>
              <CreateAccountBtn></CreateAccountBtn>
            </div>
            
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
        <img src='start/startpic.png' className={styles.SignUpPic}></img>
        <img src='start/background1.png' className={styles.SignUpBackground}></img>
        <div className={styles.Logo}><Logo></Logo></div>
    </main>
  );
}

