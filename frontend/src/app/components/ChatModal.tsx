import ReactDOM from 'react-dom';
import styles from './ChatModal.module.css';
import NotConfirmedTask from './NotConfirmedTask';
import AlterTask from './AlterTask';
import DownloadPdf from './DownloadPdf';

const ChatModal = () => {
    return ReactDOM.createPortal(
        <div className={styles.modal}>
        <div className={styles.background}>
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
        </div>
        </div>,
        document.getElementById('modal-root')! // Non-null assertion
    );
};

export default ChatModal;
