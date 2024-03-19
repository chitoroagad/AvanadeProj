"use client";

import { apiClient } from "@/app/utils/api";
import { useEffect, useState } from "react";
// import { useRouter } from "next/router";

const ChatPage = ({ params }) => {
  // const router = useRouter();
  // const { id } = router.query; // Get the chatId from the URL

  const [chat, setChat] = useState(null); // State to hold your fetched chat data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make sure id is not undefined
    if (params.id) {
      // Function to fetch chat data
      const fetchChatData = async () => {
        apiClient
          .get(`/chat/${params.id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Token " + localStorage.getItem("token"),
            },
          })
          .then((response) => response.json())
          .then((data) => {
            setLoading(false);
            setChat(data.chat);
          })
          .catch((error) => {
            console.error("Error:", error);
            setLoading(false);

            // setLoading(false); // Stop loading after the data is received
          });
      };

      fetchChatData(); // Call the function to fetch chat data
    }
  }, [params.id]); // Dependency array to ensure useEffect runs when id changes

  // Render your chat content here based on chatId
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Make sure the container takes at least the full height of the viewport
        // backgroundColor: "#f0f0f0", // Light grey background
        color: "#333", // Dark grey text for better readability
        fontFamily: "Arial, sans-serif", // Set a more specific font
        padding: "20px", // Add some padding around the content
        textAlign: "center", // Center text
        borderRadius: "10px", // Rounded corners for the container
        // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Soft shadow for depth
        maxWidth: "600px", // Max width for the content area
        margin: "auto", // Margin auto for horizontal centering if the view width exceeds max-width
      }}
    >
      {/* <h1 style={{ color: "#007bff" }}>Chat Content for ID: {params.id}</h1>{" "} */}
      {/* Blue title */}
      {!loading ? (
        <div
          style={{ background: "white", padding: "40px", borderRadius: "10px" }}
        >
          {/* Adding background, padding, and border-radius for the chat details */}
          <h2 style={{ borderBottom: "2px solid #eee", paddingBottom: "40px" }}>
            Title: {chat?.title}
          </h2>
          <p style={{ fontSize: "16px", paddingBottom: "40px" }}>
            Prompt: {chat?.prompt}
          </p>
          <p style={{ fontSize: "16px", paddingBottom: "40px" }}>
            Response: {chat?.response}
          </p>
          {/* Render additional chat content as needed */}
        </div>
      ) : (
        <p>Loading...</p> // Display a loading text or spinner while data is being fetched
      )}
    </div>
  );
};

export default ChatPage;
