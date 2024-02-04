import Logo from "../components/Logo"
import styles from "./Process.module.css"
import MainTab from "../components/MainTab"
import NoHelloUser from "../components/NoHelloUser"
import FinishedTask from "../components/FinishedTask"
import AlterTask from "../components/AlterTask"
import NotFinishedTask from "../components/NotFinishedTask"
import NotConfirmedTask from "../components/NotConfirmedTask"
import Link from "next/link"


const Process = () => {
  return (
    <main>
        <div className={styles.logo}><Logo></Logo></div>
        <div className={styles.maintab}>
          <MainTab></MainTab>
        </div>
        <div className={styles.chatName}>
            <h1>Chat name</h1>
        </div>
        <div className={styles.prompt}>
            <img src='home/search.png' className={styles.promptPic}></img>
            <input type="text" placeholder="Prompt: typed" className={styles.promptText} disabled={true}></input>
        </div>
        <div className={styles.tasks}>
            <h1 className={styles.taskTag}>Requested Tasks</h1>
            <p className={styles.taskDes}>Tasks are split to descriptions, with Agents supervision and handling</p>
            <div className={styles.taskBG}>
              <div className={styles.tasksList}>
                  <div className={styles.finishedTask}>
                      <FinishedTask initialText="Done"></FinishedTask>
                  </div>
                  <div className={styles.alterTask}>
                      <AlterTask initialText="Choose to alter"></AlterTask>
                  </div>
                  <div className={styles.notFinishedTask}>
                      <NotFinishedTask initialText="Not Finished"></NotFinishedTask>
                  </div>
                  <div className={styles.notConfirmedTask}>
                      <NotConfirmedTask initialText="Done, asks for your confirmation"></NotConfirmedTask>  
                  </div>
                  <div className={styles.error}>
                      <img src='./process/error.png' className={styles.errorPic}></img> {/* Think about where to put it */}
                  </div>
                  <button className={styles.addTask}><p>- Add your task here...</p></button>
                  <Link href='/NewChat'>
                    <button className={styles.submit}><img src='./process/submit.png'></img></button>
                  </Link>
              </div>
            </div>
        </div>
        
        <div className={styles.processBackground}>
            <img src="./process/background2.png" alt="process" />
        </div>
        <NoHelloUser></NoHelloUser>
    </main>
  )
}

export default Process