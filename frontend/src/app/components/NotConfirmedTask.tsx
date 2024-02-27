'use client';
import React, { useState, useEffect } from 'react';
import styles from './NotConfirmedTask.module.css';

const NotConfirmedTask = ({ initialText }: { initialText: any }) => {
  const [notConfirmedText, setNotConfirmedText] = useState(initialText);

  useEffect(() => {
    // Example function to fetch data from the backend
    const fetchNotConfirmedText = async () => {
      try {
        // Replace withbackend call
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
      <img src='./process/notconfirmed.png' className={styles.notConfirmedPic}/>
      <p className={styles.notConfirmedText}>{notConfirmedText}</p>
    </div>
  );
};

export default NotConfirmedTask;
