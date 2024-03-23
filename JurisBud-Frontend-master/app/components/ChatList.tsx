"use client";
import React, { useState } from 'react';
import ChatBtn from './ChatBtn';
import ChatModal from './ChatModal'; // Make sure to create or import a Modal component

const ChatList = ({items, setItems}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({title: '', id:-1, prompt: '', response: '', tags: ''});
  const handleDelete = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleButtonClick = (id: number) => {
    setSelectedItem(items.filter(item => item.id === id)[0]);
    console.log('selected chat:', selectedItem);
    setIsModalVisible(true);
  };

  return (
    <div>
      {items.map(item => (
        <ChatBtn
          key={item.id}
          text={item.title}
          onDelete={() => handleDelete(item.id)}
          onClick={() => handleButtonClick(item.id)}
        />
      ))}
      {isModalVisible && 
        <ChatModal item={selectedItem} />}
    </div>
  );
};

export default ChatList;
