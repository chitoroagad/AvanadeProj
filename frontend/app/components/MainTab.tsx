import Logo from "./Logo"
import styles from "./MainTab.module.css"
import ChatDropDown from "./ChatDropdown"
import SpaceDropDown from "./SpaceDropdown"

const MainTab = () => {
  return (
    <main>
      <div className={styles.background}>
        <div className={styles.dashboard}>
            <img src="./maintab/dashboard.png" alt="dashboard" className={styles.tabpic}/>
            <p>Dashboard</p>
        </div>
        <div className={styles.space}>
            <img src="./maintab/space.png" alt="space" className={styles.tabpic} />
            <SpaceDropDown></SpaceDropDown>
        </div>
        <div className={styles.chat}>
            <img src="./maintab/chat.png" alt="chat" className={styles.tabpic} />
            <ChatDropDown></ChatDropDown>
        </div>
        <div className={styles.logo}>
            <Logo></Logo>
        </div>
      </div>

    </main>
  )
}

export default MainTab