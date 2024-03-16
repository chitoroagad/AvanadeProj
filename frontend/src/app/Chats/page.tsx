"use client";

import NoHelloUser from "../components/NoHelloUser";
import MainTab from "../components/MainTab";
import styles from "./Chats.module.css";
import Link from "next/link";
import ChatList from "../components/ChatList";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/contexts";
import { redirect } from "@/node_modules/next/navigation";
import { apiClient } from "../utils/api";

const Chats = () => {
  const { isAuth, setIsAuth, username, setUsername } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (!isAuth) {
      redirect("/");
    }
  }, [isAuth]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const response = await apiClient.get("/chats", {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          const data = await response.json();
          setChats(data.chats);
        } else if (response.status == 401) {
          setIsAuth(false);
          username("");
          redirect("/");
        }
      } catch (err) {
        console.log("chats errors:", err);
      }
    };
    getChats();
  }, []);
  return (
    <main>
      {/* <div className={styles.maintab}><MainTab/></div> */}
      <div className={styles.chatMenu}>
        <h1 className={styles.chatTitle}>Chats</h1>
        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          ></input>
          <Image
            src="/home/search.png"
            width={0}
            height={0}
            sizes="100vw"
            className={styles.searchPic}
            alt="search"
          />
        </div>
        <div className={styles.chatList}>
          <ChatList items={chats} setItems={setChats} />
        </div>
      </div>
      <div id="modal-root"></div>
      <div className={styles.chatsBackground}>
        <Image
          width={0}
          height={0}
          sizes="100vw"
          src="/process/background2.png"
          alt="process"
        />
      </div>
      <NoHelloUser></NoHelloUser>
    </main>
  );
};

export default Chats;
