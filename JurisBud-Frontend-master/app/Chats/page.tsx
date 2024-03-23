"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/contexts";
import { redirect } from "@/node_modules/next/navigation";
import { apiClient } from "../utils/api";

import Link from "next/link";
import styles from "./Chats.module.css"; // Link to your CSS module

const ChatsList = () => {
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

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div
              style={{
                alignContent: "right",
                color: "greenyellow",
                fontSize: "30px",
              }}
            >
              <Link href={`/Process`} legacyBehavior>
                +
              </Link>
            </div>
          </div>
          <div className={styles.tableHeader}>
            <div className={styles.headerItem}>Ttile</div>
            <div className={styles.headerItem}>Response</div>
            <div className={styles.headerItem}>Created At</div>
          </div>
          {Array.isArray(chats) &&
            chats.map((chat) => (
              <Link href={`/chat/${chat.id}`} key={chat.id} passHref>
                <div className={styles.tableRow}>
                  <div className={styles.rowItem}>{chat.title}</div>
                  <div className={styles.rowItem}>{chat.response}</div>
                  <div className={styles.rowItem}>
                    {formatDate(chat.created_at)}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default ChatsList;
