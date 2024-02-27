'use client';
import React, { useState, useEffect } from 'react';
import styles from './NotFinishedTask.module.css';

const NotFinishedTask = ({ initialText }: { initialText: any }) => {
  const [notFinishedText, setNotFinishedText] = useState(initialText);

  useEffect(() => {
    // Example function to fetch data from the backend
    const fetchNotFinishedText = async () => {
      try {
        // Replace withbackend call
        const response = await fetch('your-backend-endpoint');
        const data = await response.json();
        setNotFinishedText(data.newText);
      } catch (error) {
        console.error('Error fetching not finished text:', error);
      }
    };

    fetchNotFinishedText();
  }, []); 

  return (
    <div className={styles.notFinishedTask}>
      <img src='./process/notdone.png' className={styles.notFinishedPic}/>
      <p className={styles.notFinishedText}>{notFinishedText}</p>
    </div>
  );
};

export default NotFinishedTask;
