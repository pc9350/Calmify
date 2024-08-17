"use client";

import FacialRecognitionButton from "./FacialRecognitionButton";
import { Box, TextField, Button } from "@mui/material";
import React, { useState } from "react";
import Wallpaper from "../../public/landing-background.jpeg";
import TinderCard from "react-tinder-card";

export default function LandingPage({ isSubscribed }) {
  const [userMessage, setUserMessage] = useState("");
  const [flashcards, setFlashcards] = useState([
    { front: "How are you feeling today?", back: "How are you feeling today?" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const [capturedValue, setCapturedValue] = useState({
    emotions: [{ Type: "Neutral" }],
  });

  const handleCapture = async (result) => {
    setCapturedValue(result);
    const emotionType = result.emotions[0].Type;
    sendMessage(emotionType);
  };

  const classifyMessage = async (message) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      return data.type;
    } catch (error) {
      console.error("Error:", error);
      return "other";
    }
  };

  const sendMessage = async (emotionType = "") => {
    const messageToSend = userMessage.trim() === "" ? `I am ${emotionType.toLowerCase()}` : userMessage;
  
    if (!messageToSend.trim() || isLoading) return;
    setIsLoading(true);
  
    const messageType = await classifyMessage(messageToSend);
  
    let response;
    if (messageType === "greeting") {
      setFlashcards([{ front: "Hello! How can I assist you today?", back: "Hello! How can I assist you today?" }]);
    } else if (messageType === "emotional") {
      response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: `Emotion: ${emotionType}` })
      });
    } else {
      response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: messageToSend })
      });
    }
  
    if (!response.ok) {
      console.error("Network response was not ok:", response.statusText);
      throw new Error("Network response was not ok");
    }
  
    const data = await response.json();
    console.log("API response data:", data); 
    setFlashcards(data.flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsLoading(false);
  };  

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const onSwipe = (direction) => {
    if (direction === "right") {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      }
    }
  };

  const handleSwipeStart = () => {
    setIsSwiping(true);
  };

  const handleSwipeEnd = () => {
    setIsSwiping(false);
  };

  const handleCardClick = () => {
    if (!isSwiping) {
      setIsFlipped(!isFlipped);
    }
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
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ width: "100%", position: "relative" }}
          >
            {flashcards.length > 0 && (
              <TinderCard
                flickOnSwipe
                onSwipe={onSwipe}
                onSwipeStart={handleSwipeStart}
                onSwipeEnd={handleSwipeEnd}
                preventSwipe={["bottom"]}
                swipeRequirementType="position"
                swipeThreshold={20}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "500px",
                    height: "500px",
                  }}
                >
                  <Box
                    onClick={handleCardClick}
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.6s",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backfaceVisibility: "hidden",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(128, 128, 128, 0.5)",
                        color: "black",
                        p: 3,
                      }}
                    >
                      {flashcards[currentIndex].front}
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(128, 128, 128, 0.5)",
                        color: "black",
                        p: 3,
                      }}
                    >
                      {flashcards[currentIndex].back}
                    </Box>
                  </Box>
                </Box>
              </TinderCard>
            )}

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
                  border: "1px solid lightgray",
                  textTransform: "none",
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(128, 128, 128, 0.5)",
                  "&:hover": {
                    borderColor: "black",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
                    background: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </Box>
            
            {isSubscribed && (
              <div className="mt-12">
              <FacialRecognitionButton onCapture={handleCapture} />
            </div>
            )}
            
          </Box>
        </Box>
      </Box>
    </>
  );
}
