"use client";

import React, { useState } from "react";
import styles from "./CreateSpace.module.css"; // Make sure you link to the correct CSS module

const CreateSpace = () => {
  // State setup for form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  // Dummy groups for select, replace with your data
  const groups = [
    { id: "1", name: "Group 1" },
    { id: "2", name: "Group 2" },
    // Add more groups here
  ];

  // Form submission logic here...

  return (
    <div className={styles.container}>
      <h1>Create a New Space</h1>
      <form className={styles.form}>
        <input
          className={styles.input}
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className={styles.textarea}
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className={styles.select}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="">Select a group</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
        <div className={styles.tagsInput}>
          <input
            className={styles.input}
            type="text"
            value={newTag}
            placeholder="Add a tag"
            onChange={(e) => setNewTag(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && addTag()}
          />
          <button type="button" onClick={addTag} className={styles.tagButton}>
            Add Tag
          </button>
        </div>
        <div className={styles.tagsDisplay}>
          {tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <button type="submit" className={styles.button}>
          Create Space
        </button>
      </form>
    </div>
  );
};

export default CreateSpace;
