import NoHelloUser from "../components/NoHelloUser";
import MainTab from "../components/MainTab";
import styles from './Space.module.css';
import Link from 'next/link';
import EditableTag from "../components/EditableTag";

const Chats = () => {
return(
<main>
    <div className={styles.maintab}><MainTab></MainTab></div>
    <div className={styles.title}>
        <h1>Space</h1>
    </div>
    <div className={styles.FirRec}>
        <div className={styles.left}>
            <div className={styles.tags}>
                <img src="./space/tags.png" className={styles.pic}></img>
                <p>&nbsp;&nbsp;Tags</p>
                <div className={styles.tag}>
                    <EditableTag initialText="Tag1"></EditableTag>
                </div>
            </div>
            <div className={styles.createdAt}>
                <img src="./space/createdAt.png" className={styles.pic}></img>
                <p>&nbsp;&nbsp;Created At</p>
                <div className={styles.time}>
                    <p>place for timestamp fetched in backend</p>
                </div>
            </div>
        </div>
        <div className={styles.description}>
            <h2>Description</h2>
            <input type="text" placeholder="Description"></input>
        </div>
    </div>
    <div className={styles.SecRec}>
    <div className={styles.chatwithTag}>
        <button className={styles.chatCard}>
            <p>Chat Name</p>
            <div className={styles.cardtag}><EditableTag initialText="Tag2"></EditableTag></div>
        </button>
        <button className={styles.chatCard}>
            <p>Chat Name</p>
            <div className={styles.cardtag}><EditableTag initialText="Tag3"></EditableTag></div>
        </button>
    </div>
    </div>
    <div className={styles.spaceBackground}>
        <img src="./process/background2.png" alt="process" />
     </div>
    <NoHelloUser></NoHelloUser>
</main>

);
};

export default Chats;