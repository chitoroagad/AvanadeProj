"use client";

import React, { useRef } from 'react';
import styles from './Attachment.module.css';

const Attachment = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Handle the file
      console.log(file); // Example: Log to console
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

  return (
    <main>
      <div className={styles.AttachContainer}>
        <img src='home/attach.png' className={styles.Attach} onClick={handleAttachmentClick} />
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    </main>
  );
};

export default Attachment;
