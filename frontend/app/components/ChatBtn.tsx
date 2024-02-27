"use client";
import React from 'react';
import styles from './ChatBtn.module.css';

const ChatBtn = ({ text, onDelete, onClick }: { text: string, onDelete: () => void, onClick: () => void }) => {
  return (
    <div className={styles.box} onClick={onClick}>
      <button className="btn btn-wide">{text}</button>
      <button className={styles.button} onClick={onDelete}>
        <img src='chat/delete.png' className={styles.deletePic}></img>
      </button>
    </div>
  );
};

export default ChatBtn;
