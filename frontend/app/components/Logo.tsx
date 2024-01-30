import React from 'react'
import styles from './Logo.module.css'
// interface LogoProps {
//     children: React.ReactNode;
//   }
//{children}: LogoProps

const Logo = () => {
  return ( 
    <div className={styles.logo}> 
        <img src='logo.png' className={styles.logopic}></img>
        <div className={styles.logoText} >
          <p>JurisBUD<br></br>AI</p>
        </div>
    </div>
    
  )
}

export default Logo