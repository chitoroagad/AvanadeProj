"use client";
import React, { useState } from 'react';
import ChatBtn from './ChatBtn';
import ChatModal from './ChatModal'; // Make sure to create or import a Modal component

const ChatList = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Hi' },
    { id: 2, text: 'Bye' }
    // Add more items as needed
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleButtonClick = (text: string) => {
    setIsModalVisible(true);
  };

  return (
    <div>
      {items.map(item => (
        <ChatBtn
          key={item.id}
          text={item.text}
          onDelete={() => handleDelete(item.id)}
          onClick={() => handleButtonClick(item.text)}
        />
      ))}
      {isModalVisible && 
        <ChatModal/>}
    </div>
  );
};

export default ChatList;
