"use client";

import React, { useRef } from 'react';
import styles from './Attachment.module.css';
// ... other imports ...

const Attachment = () => {
  // Explicitly type fileInputRef as a ref to an HTMLInputElement
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      // Handle the file (e.g., store in state, upload to server, etc.)
      console.log(file); // Example: Log to console
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Now TypeScript knows fileInputRef.current is an HTMLInputElement
    }
  };

  // ... other component logic ...

  return (
    <main>
      {/* ... other components ... */}
      <div className={styles.AttachContainer}>
        <img src='home/attach.png' className={styles.Attach} onClick={handleAttachmentClick} />
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
      </div>

      {/* ... other components ... */}
    </main>
  );
};

export default Attachment;
