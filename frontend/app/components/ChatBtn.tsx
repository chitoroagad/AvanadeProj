"use client";
import React from 'react';
import styles from './ChatBtn.module.css';
import Image from "next/image";

const ChatBtn = ({ text, onDelete, onClick }: { text: string, onDelete: () => void, onClick: () => void }) => {
  return (
    <div className={styles.box} onClick={onClick}>
      <button className="btn btn-wide">{text}</button>
      <button className={styles.button} onClick={onDelete}>
        <Image src='/chat/delete.png' width={0} height={0} sizes="100vw" className={styles.deletePic} alt='delete' />
      </button>
    </div>
  );
};

export default ChatBtn;
