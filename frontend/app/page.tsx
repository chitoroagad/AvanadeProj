import Link from "next/link";
import styles from "./Start.module.css";
import Logo from "./components/Logo";

export default function Start() {
  return (
    <main>
        <div className={styles.Start}>
          <div>
            <h1 className={styles.StartTitle}>Welcome Back!</h1>
          </div>
          <div className={styles.Box}>
            <div>
              <h2 className={styles.StartSubtitle}>Sign Into Your Account</h2>
            </div>
            <img src='start/msgicon.png' className={styles.MsgIcon}></img>
            <div className={styles.LoginInfo}>
              <p>Email:</p>
              <input type="text" className={styles.Input} placeholder="Enter Email here"></input>
              <p>Password:</p>
              <input type="text" className={styles.Input} placeholder="Enter Password here"></input>
            </div>
            <div className={styles.RemAndFor}>
                <div className={styles.RememberMe}>
                  <label className="label cursor-pointer">
                    <span className="label-text">Remember me&nbsp;</span> 
                    <input type="checkbox" className="checkbox" />
                  </label>
                </div>
                <div className={styles.ForgotPwd}><p>Forgot password?</p></div>
            </div>
            <div className={styles.LoginBtn}>
              <Link href="/Home">
                <button className='btn btn-wide btn-primary'>Login</button>
              </Link>
            </div>
            <div className={styles.SignUp}>
              <p>Don't have an account?</p>
              <div className={styles.SignUpText}>
                <Link href="/SignUp">
                <p>Sign Up</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <img src='start/startpic.png' className={styles.StartPic}></img>
        <img src='start/background1.png' className={styles.StartBackground}></img>
        <div className={styles.Logo}><Logo></Logo></div>
    </main>
  );
}

