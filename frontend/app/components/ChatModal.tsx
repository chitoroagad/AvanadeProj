import ReactDOM from 'react-dom';
import styles from './ChatModal.module.css';
import NotConfirmedTask from './NotConfirmedTask';
import AlterTask from './AlterTask';
import DownloadPdf from './DownloadPdf';
import Image from "next/image";

const ChatModal = ({item}) => {
    return ReactDOM.createPortal(
        <div className={styles.modal}>
        <div className={styles.background}>
            <div className={styles.chatName}>
                <h1>{item.title}</h1>
            </div>
            <div className={styles.prompt}>
                <Image src='/home/search.png' width={0} height={0} sizes="100vw" className={styles.promptPic} alt='prompt' />
                <input type="text" placeholder="Prompt: typed" value={item.prompt} className={styles.promptText} disabled={true}></input>
                <button className={styles.regenBtn}><AlterTask initialText="Regenerate Response" ></AlterTask></button>
                <button className={styles.restrBtn}><NotConfirmedTask initialText="Task Restructure"></NotConfirmedTask></button>
            </div>
            <div className={styles.responseTag}>
                <h1>Response</h1>
            </div>
            <div className={styles.response}>
                <p id="text-to-download">{item.response}</p>
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
