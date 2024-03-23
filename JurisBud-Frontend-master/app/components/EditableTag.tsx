"use client";
import React, { useState } from "react";
import styles from "./EditableTag.module.css";

interface EditableTagProps {
  initialText: string;
}

const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const EditableTag: React.FC<EditableTagProps> = ({ initialText }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [text, setText] = useState<string>(initialText);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    getRandomColor()
  );
  console.log(initialText);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div style={{ backgroundColor }} className={styles.tags}>
      {isEditing ? (
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          onBlur={toggleEdit}
          autoFocus
        />
      ) : (
        <span onClick={toggleEdit}>{text}</span>
      )}
    </div>
  );
};

export default EditableTag;
