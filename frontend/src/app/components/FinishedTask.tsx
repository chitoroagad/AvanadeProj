'use client';
import React, { useState, useEffect } from 'react';
import styles from './FinishedTask.module.css';

const FinishedTask = ({ initialText }: { initialText: any }) => {
  const [finishedText, setFinishedText] = useState(initialText);

  useEffect(() => {
    // Example function to fetch data from the backend
    const fetchFinishedText = async () => {
      try {
        // Replace with backend call
        const response = await fetch('your-backend-endpoint');
        const data = await response.json();
        setFinishedText(data.newText);
      } catch (error) {
        console.error('Error fetching finished text:', error);
      }
    };

    fetchFinishedText();
  }, []); 

  return (
    <div className={styles.finishedTask}>
      <img src='./process/ticked.png' className={styles.finishedPic}/>
      <p className={styles.finishedText}>{finishedText}</p>
    </div>
  );
};

export default FinishedTask;
