import styles from './NewChat.module.css'
import MainTab from '../components/MainTab'
import AlterTask from '../components/AlterTask'
import NotConfirmedTask from '../components/NotConfirmedTask'
import NoHelloUser from '../components/NoHelloUser'
import jsPDF from 'jspdf'
import DownloadPdf from '../components/DownloadPdf'


const NewChat = () =>{
    
    return(
        <main>
            <div className={styles.maintab}><MainTab></MainTab></div>
            <div className={styles.chatName}>
                <h1>Chat name</h1>
            </div>
            <div className={styles.prompt}>
                <img src='home/search.png' className={styles.promptPic}></img>
                <input type="text" placeholder="Prompt: typed" className={styles.promptText} disabled={true}></input>
                <button className={styles.regenBtn}><AlterTask initialText="Regenerate Response" ></AlterTask></button>
                <button className={styles.restrBtn}><NotConfirmedTask initialText="Task Restructure"></NotConfirmedTask></button>
            </div>
            <div className={styles.responseTag}>
                <h1>Response</h1>
            </div>
            <div className={styles.response}>
                <p id="text-to-download">Example Response</p>
            </div>
            <div className={styles.download}>
                <DownloadPdf></DownloadPdf>
            </div>
            <div className={styles.newchatBackground}>
                <img src="./process/background2.png" alt="process" />
            </div>
            <NoHelloUser></NoHelloUser>
        </main>
    )




}

export default NewChat