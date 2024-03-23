"use client";

import React, { useEffect, useState } from "react";
import TabButton from "../components/BtnTabProp";
import { apiClient } from "../utils/api";

const BtnTab = () => {
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    // Set the active path based on the current URL
    setActivePath(window.location.pathname);
  }, []);

  return (
    <div>
      <TabButton isActive={activePath === "/Home"} href="/Home">
        Home
      </TabButton>
      <TabButton isActive={activePath === "/Spaces"} href="/Spaces">
        Spaces
      </TabButton>
      <TabButton isActive={activePath === "/Chats"} href="/Chats">
        Chats
      </TabButton>
    </div>
  );
};

export default BtnTab;
