"use client";
import React, { useState, useEffect } from 'react';
import DynamicDropdown from './DynamicDropdown';
import styles from './ChatDropdown.module.css'; 

const ChatDropDown = () => {
    const [chatHistory, setChatHistory] = useState<Array<{ href: string; label: string; }>>([]);

    useEffect(() => {
        // Fetch chat history
        const history = [
            { href: '/chat/1', label: 'Chat 1' },
            { href: '/chat/2', label: 'Chat 2' },
            { href: '/Chats',  label: '--All Chats--'},
            { href: '/Home', label: '--New Chat--'},
        ];

        setChatHistory(history);
    }, []);

    return (
        <div className={styles.chatDropDownContainer}>
            <p className={styles.chatLabel}>Chats</p> 
            <DynamicDropdown links={chatHistory} />
        </div>
    );
};

export default ChatDropDown;
