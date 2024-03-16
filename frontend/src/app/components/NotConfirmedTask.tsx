'use client';
import React, { useState, useEffect } from 'react';
import styles from './NotConfirmedTask.module.css';
import Image from "next/image";

const NotConfirmedTask = ({ initialText }: { initialText: any }) => {
  const [notConfirmedText, setNotConfirmedText] = useState(initialText);

  useEffect(() => {
    // Example function to fetch data from the backend
    const fetchNotConfirmedText = async () => {
      try {
        // Replace with backend call
        const response = await fetch('your-backend-endpoint');
        const data = await response.json();
        setNotConfirmedText(data.newText);
      } catch (error) {
        console.error('Error fetching not Confirmed text:', error);
      }
    };

    fetchNotConfirmedText();
  }, []); 

  return (
    <div className={styles.notConfirmedTask}>
      <Image width={0} height={0} sizes="100vw" src='/process/notconfirmed.png' className={styles.notConfirmedPic} alt='not confirmed' />
      <p className={styles.notConfirmedText}>{notConfirmedText}</p>
    </div>
  );
};

export default NotConfirmedTask;
