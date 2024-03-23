"use client";

import Logo from "./Logo";
import styles from "./MainTab.module.css";
import ChatDropDown from "./ChatDropdown";
import SpaceDropDown from "./SpaceDropdown";
import Image from "next/image";
import { useEffect, useState } from "react";
import { apiClient } from "../utils/api";
import ChatList from "./ChatList";
import Link from "next/link";

const MainTab = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false); // S
  const [chats, setChats] = useState([]);
  const [spaces, setSpaces] = useState([]);

  // const spaces = [
  //   {
  //     id: 1,
  //     title: "space1",
  //   },
  //   {
  //     id: 2,
  //     title: "space2",
  //   },
  // ];

  const sendRequest = () => {
    setLoading(true); // Start loading

    // Here you would replace 'your-api-endpoint' with your actual API endpoint
    // and adjust headers and body according to your API requirements

    apiClient
      .get("/chats", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResponse(data);
        setChats(data?.chats);
        setLoading(false); // Stop loading after the data is received
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // Stop loading after the data is received
      });

    apiClient
      .get("/spaces", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResponse(data);
        setSpaces(data);
        setLoading(false); // Stop loading after the data is received
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // Stop loading after the data is received
      });
  };

  const deleteChat = (chatId) => {
    setLoading(true); // Start loading for deletion process

    // Here you would replace 'your-api-endpoint' with your actual API endpoint
    // and adjust headers and method according to your API requirements

    apiClient
      .delete(`/chat/delete/${chatId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("token"),
        },
      })
      .then(() => {
        // After deleting, fetch the updated list of chats
        return apiClient.get("/chats", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
      })
      .then((response) => response.json())
      .then((data) => {
        setChats(data?.chats); // Update the list of chats
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // In case of an error, stop the loading as well
      });
  };

  useEffect(() => {
    sendRequest();
  }, []); // 2000

  return (
    <main>
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <Logo />
        </div>
        <Link href="/" className={styles.tab}>
          <div className={styles.dashboardTab}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                width={30}
                height={30}
                // sizes="80vw"
                src="/maintab/dashboard.jpeg"
                alt="dashboard"
                className={styles.tabpic}
              />
              <p>Dashboard</p>
            </div>
            <button
              onClick={() => {}}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              {/* <Image
                src={"/maintab/arrow-down.png"}
                alt={"altText"}
                width={20}
                height={20}
              /> */}
            </button>
          </div>
        </Link>
        <Link href="/Spaces" className={styles.tab}>
          <div className={styles.dashboardTab}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                width={30}
                height={30}
                // sizes="80vw"
                src="/maintab/space.jpeg"
                alt="spaces"
                className={styles.tabpic}
              />
              <p>Spaces</p>
            </div>
            <button
              onClick={() => {}}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <Image
                src={"/maintab/arrow-down.png"}
                alt={"altText"}
                width={20}
                height={20}
              />
            </button>
          </div>
          {spaces?.map((space) => (
            <div
              key={space.id}
              className={styles.chatItem}
              style={{
                marginLeft: "3rem",
              }}
            >
              <Link legacyBehavior href={`/Space/${space.id}`}>
                <a className={styles.chatTitle}>{space.name}</a>
              </Link>
            </div>
          ))}
        </Link>
        <Link href="/Chats" className={styles.tab}>
          <div className={styles.dashboardTab}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                width={30}
                height={30}
                // sizes="80vw"
                src="/maintab/chat.jpeg"
                alt="spaces"
                className={styles.tabpic}
              />
              <p>Chats</p>
            </div>
            <button
              onClick={() => {
                console.log("cchaats button");
              }}
              style={{
                border: "none",
                background: "none",
                padding: 0,
                cursor: "pointer",
              }}
              onKeyDown={(event) => {
                event.stopPropagation();
              }}
            >
              <Image
                src={"/maintab/arrow-down.png"}
                alt={"altText"}
                width={20}
                height={20}
              />
            </button>
          </div>
          <div className={styles.listing}>
            {!loading
              ? chats.map((chat) => (
                  <div key={chat.id} className={styles.chatItem}>
                    <Link legacyBehavior href={`/chat/${chat.id}`}>
                      <a className={styles.chatTitle}>{chat.title}</a>
                    </Link>
                    <button
                      onClick={() => deleteChat(chat.id)}
                      disabled={loading} // Disable the button while loading
                      className={styles.deleteButton}
                    >
                      {loading ? (
                        <span>Loading...</span> // You can replace this with a spinner icon
                      ) : (
                        <Image
                          src="/chat/delete.png" // Put the path to your delete icon here
                          alt="Delete"
                          width={20}
                          height={20}
                        />
                      )}
                    </button>
                  </div>
                ))
              : "Loading..."}
          </div>
        </Link>
        {/* Add more navigation links as needed */}
      </div>
    </main>
  );
};

export default MainTab;

{
  /* <div className={styles.background}>
        <div className={styles.dashboard}>
            <Image width={0} height={0} sizes="100vw" src="/maintab/dashboard.png" alt="dashboard" className={styles.tabpic}/>
            <p>Dashboard</p>
        </div>
        <div className={styles.space}>
            <Image width={0} height={0} sizes="100vw" src="/maintab/space.png" alt="space" className={styles.tabpic} />
            <SpaceDropDown></SpaceDropDown>
        </div>
        <div className={styles.chat}>
            <Image width={0} height={0} sizes="100vw" src="/maintab/chat.png" alt="chat" className={styles.tabpic} />
            <ChatDropDown></ChatDropDown>
        </div>
        <div className={styles.chatList}>
          <ChatList items={chats} setItems={setChats} />    
        </div>
        <div className={styles.logo}>
            <Logo></Logo>
        </div>
      </div> */
}
