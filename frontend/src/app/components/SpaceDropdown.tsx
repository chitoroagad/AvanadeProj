"use client";
import React, { useState, useEffect } from 'react';
import DynamicDropdown from './DynamicDropdown';
import styles from './SpaceDropdown.module.css'; 

const SpaceDropDown = () => {
    const [chatHistory, setChatHistory] = useState<Array<{ href: string; label: string; img: string; }>>([]);

    useEffect(() => {
        // Fetch chat history or compute it
        const history = [
            { href: '/space/1', label: 'Space 1', img:'./logo.png' },
            { href: '/space/2', label: 'Space 2', img:'./logo.png' },
            // More chats...
        ];

        setChatHistory(history);
    }, []);

    return (
        <div className={styles.chatDropDownContainer}>
            <p className={styles.chatLabel}>Spaces</p> 
            <DynamicDropdown links={chatHistory} />
        </div>
    );
};

export default SpaceDropDown;
