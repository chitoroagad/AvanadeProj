"use client";

import React, { useRef } from "react";
import styles from "./Attachment.module.css";
import Image from "next/image";
import { apiClient } from "../utils/api";

//@ts-ignore
const Attachment = ({ setPrompt }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      console.log(file);
      var formData = new FormData();
      formData.append("file", file);
      try {
        const response = await apiClient.post("/chat/upload_prompt", {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
          body: formData,
        });
        const data = await response.json();
        setPrompt(data.file.content);
      } catch (err) {
        console.log("file upload error:", err);
      }
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
        <Image
          src="/home/attach.png"
          width={0}
          height={0}
          sizes="100vw"
          className={styles.Attach}
          onClick={handleAttachmentClick}
          alt="attachment"
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </main>
  );
};

export default Attachment;
