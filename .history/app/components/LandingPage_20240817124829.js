"use client";

import FacialRecognitionButton from "./FacialRecognitionButton";
import { Stack, Box, TextField, Button } from "@mui/material";
import TinderCard from "react-tinder-card";
import React, { useState, useRef, useEffect } from "react";
import Wallpaper from "../../public/landing-background.jpeg";

export default function LandingPage({ isSubscribed }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "How are you feeling today?",
    },
  ]);

  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [capturedValue, setCapturedValue] = useState({
    emotions: [{ Type: "Neutral" }],
  });

  const handleCapture = (result) => {
    setCapturedValue(result);
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;
    setIsLoading(true);

    const messageToSend = userMessage;
    let emotion_type = "";
    setUserMessage("");

    setMessages((messages) => [
      ...messages,
      { role: "user", content: messageToSend },
      { role: "assistant", content: "" },
    ]);
    console.log();
    if (capturedValue["emotions"] && capturedValue["emotions"].length > 0) {
      emotion_type = "Neutral";
    } else {
      emotion_type = capturedValue["emotions"][0]["Type"];
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          ...messages,
          {
            role: "user",
            content: messageToSend + "Emotion:" + emotion_type,
          },
        ]),
      });

      if (!response.ok) thrownewError("Network response was not ok");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          const lastMessage = messages[messages.length - 1];
          const otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSwipe = (direction) => {
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (identifier) => {
    console.log(identifier + " left the screen");
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${Wallpaper.src})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            marginTop: "10%",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginBottom="100px"
            sx={{ width: "100%" }}
          >
            <TinderCard
              flickOnSwipe
              onSwipe={onSwipe}
              onCardLeftScreen={() => onCardLeftScreen("fooBar")}
              preventSwipe={["bottom"]}
            >
              <Stack
                direction="column"
                spacing={2}
                flexGrow={1}
                overflow="auto"
                maxHeight="100%"
              >
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent={
                      message.role === "assistant" ? "flex-start" : "flex-end"
                    }
                  >
                    <Box
                      alignItems="center"
                      justifyContent="center"
                      display="flex"
                      width="500px"
                      height="500px"
                      backgroundColor="rgba(255, 255, 255, 0.8)"
                      borderRadius="8px"
                      boxShadow="0 4px 8px rgba(128, 128, 128, 0.5)"
                      color="black"
                      p={3}
                    >
                      {message.content}
                    </Box>
                  </Box>
                ))}
                <div ref={messagesEndRef} />
              </Stack>
            </TinderCard>

            <Box
              width="100%"
              maxWidth="500px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
            >
              <TextField
                label="Message"
                fullWidth
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                sx={{
                  marginTop: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(128, 128, 128, 0.5)",
                  color: "black",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "lightgray" },
                    "&:hover fieldset": { borderColor: "black" },
                    "&.Mui-focused fieldset": { borderColor: "black" },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                    },
                    "& input": { color: "black" },
                  },
                  "& .MuiInputLabel-root": { color: "black" },
                  "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                }}
              />
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
                sx={{
                  height: "55px",
                  marginLeft: "5px",
                  border: "1pxsolidlightgray",
                  textTransform: "none",
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                  boxShadow: "04px8pxrgba(128, 128, 128, 0.5)",
                  "&:hover": {
                    borderColor: "black",
                    boxShadow: "04px8pxrgba(0, 0, 0, 0.5)",
                    background: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </Box>

            {/* Facial Recognition Button - Only visible if the user is a premium subscriber isSubscribed && */}
            {
              <div className="mt-12">
                <FacialRecognitionButton onCapture={handleCapture} />
              </div>
            }
          </Box>
        </Box>
      </Box>
    </>
  );
}
