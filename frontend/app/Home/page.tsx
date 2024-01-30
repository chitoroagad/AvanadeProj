import Logo from "../components/Logo"
import styles from "./Home.module.css"
import BtnTab from "../components/BtnTab"
import User from "../components/User"
import Link from "next/link"
import Attachment from "../components/Attachment"

const Home = () => {
  return (
    
    <main>

      <div className={styles.BtnTab}>
        <BtnTab></BtnTab>
      </div>
      <div className={styles.Search}>
        <img src='home/search.png' className={styles.SearchPic}></img>
        <input type="text" placeholder="How can I help?" className={styles.HomePrompt}></input>
        <Attachment></Attachment>
      </div>
      <img src='start/background1.png' className={styles.HomeBackground}></img>
      <div className={styles.logo}><Logo></Logo></div>
      <div className={styles.GenBtn}>
        <Link href='/Process'>
          <button className='btn btn-wide btn-primary'>Generate</button>
        </Link>
      </div>
      <User></User>

     
      {/* Button Tab component, User Component */}

    </main>
  )
}

export default Home