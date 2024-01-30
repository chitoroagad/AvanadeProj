"use client";

import React, { useEffect, useState } from 'react';
import TabButton from '../components/BtnTabProp';

const HomePage = () => {
  const [activePath, setActivePath] = useState('');

  useEffect(() => {
    // Set the active path based on the current URL
    setActivePath(window.location.pathname);
  }, []);

  return (
    <div>
      <TabButton
        isActive={activePath === '/Home'}
        href="/Home"
      >
        Home
      </TabButton>
      <TabButton
        isActive={activePath === '/Space'}
        href="/Space"
      >
        Space
      </TabButton>
      <TabButton
        isActive={activePath === '/Chats'}
        href="/Chats"
    >
        Chats
        </TabButton>
    </div>
  );
};

export default HomePage;
