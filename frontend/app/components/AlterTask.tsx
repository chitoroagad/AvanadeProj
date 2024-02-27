'use client';
import React, { useState, useEffect } from 'react';
import styles from './AlterTask.module.css';

const AlterTask = ({ initialText }: { initialText: any }) => {
  const [alterText, setAlterText] = useState(initialText);

  useEffect(() => {
    // Example function to fetch data from the backend
    const fetchAlterText = async () => {
      try {
        // Replace withbackend call
        const response = await fetch('your-backend-endpoint');
        const data = await response.json();
        setAlterText(data.newText);
      } catch (error) {
        console.error('Error fetching alter text:', error);
      }
    };

    fetchAlterText();
  }, []); 

  return (
    <div className={styles.alterTask}>
      <img src='./process/alter.png' className={styles.alterPic}/>
      <p className={styles.alterText}>{alterText}</p>
    </div>
  );
};

export default AlterTask;
