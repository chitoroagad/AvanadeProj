import NoHelloUser from "../components/NoHelloUser";
import MainTab from "../components/MainTab";
import styles from './Chats.module.css';
import Link from 'next/link';

const Chats = () => {
return(
<main>
    <div className={styles.maintab}><MainTab></MainTab></div>
    <div className={styles.chatMenu}>
        <h1 className={styles.chatTitle}>Chats</h1>
        <div className={styles.search}>
            <input type="text" placeholder="Search" className={styles.searchInput}></input>
            <img src='home/search.png' className={styles.searchPic}></img>
        </div>
        <div className={styles.chatList}>
            <ul className="menu bg-base-200 w-80 rounded-box">
                <Link href='SingleChat'>
                    <li><a>Chat 1</a></li>
                </Link>
                <li><a>Chat 2</a></li>
                <li><a>Chat 3</a></li>
                
            </ul>
        </div>
    </div>
    <div className={styles.chatsBackground}>
        <img src="./process/background2.png" alt="process" />
     </div>
    <NoHelloUser></NoHelloUser>
</main>

);
};

export default Chats;