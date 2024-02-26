import NoHelloUser from "../components/NoHelloUser";
import MainTab from "../components/MainTab";
import styles from './Chats.module.css';
import Link from 'next/link';
import ChatList from "../components/ChatList";

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
            
                <ChatList></ChatList>
                
            
        </div>
        

    </div>
    <div id="modal-root"></div>
    <div className={styles.chatsBackground}>
        <img src="./process/background2.png" alt="process" />
     </div>
    <NoHelloUser></NoHelloUser>
</main>

);
};

export default Chats;