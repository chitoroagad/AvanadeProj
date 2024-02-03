import Logo from "../components/Logo"
import styles from "./Process.module.css"
import MainTab from "../components/MainTab"

const Process = () => {
  return (
    <main>
        <div className={styles.logo}><Logo></Logo></div>
        <div className={styles.maintab}>
        <MainTab></MainTab>
        </div>
        <div className={styles.processBackground}>
            <img src="./process/background2.png" alt="process" />
        </div>
    </main>
  )
}

export default Process