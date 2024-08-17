"use client";

import FacialRecognitionButton from "./FacialRecognitionButton";
<<<<<<< HEAD
import { Box, TextField, Button } from "@mui/material";
import TinderCard from 'react-tinder-card';
import React, { useState, useRef } from 'react';
import Wallpaper from '../../public/landing-background.jpeg';

export default function LandingPage({ isSubscribed }) {
  const [userMessage, setUserMessage] = useState('');
  const [flashcards, setFlashcards] = useState([{ front: "How are you feeling today?", back: "" }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false); 
  const cardRef = useRef(null);
=======
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
  const [capturedValue, setCapturedValue] = useState({});

  const handleCapture = (result) => {
    setCapturedValue(result);
  };
>>>>>>> emotion

  const sendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;
    setIsLoading(true);

    const messageToSend = userMessage;
    setUserMessage("");

<<<<<<< HEAD
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: messageToSend }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
=======
    setMessages((messages) => [
      ...messages,
      { role: "user", content: messageToSend },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([
          ...messages,
          {
            role: "user",
            content:
              messageToSend + "Emotion:" + capturedValue["emotions"][0]["Type"],
          },
        ]),
      });

      if (!response.ok) thrownewError("Network response was not ok");
>>>>>>> emotion

      const data = await response.json();
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
<<<<<<< HEAD
      console.error('Error:', error);
      setFlashcards([{ front: "I'm sorry, but I encountered an error. Please try again later.", back: "" }]);
=======
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
>>>>>>> emotion
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const onSwipe = (direction) => {
<<<<<<< HEAD
    if (direction === 'right') {
      setFlashcards((prevCards) => [
        ...prevCards,
        { front: `New Flashcard Front ${prevCards.length + 1}`, back: `New Flashcard Back ${prevCards.length + 1}` }
      ]);

      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setIsFlipped(false);
    }
  };

  const handleCardClick = () => {
    if (!isSwiping) { 
      setIsFlipped(!isFlipped);
    }
=======
    console.log("You swiped: " + direction);
  };

  const onCardLeftScreen = (identifier) => {
    console.log(identifier + " left the screen");
>>>>>>> emotion
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${Wallpaper.src})`,
<<<<<<< HEAD
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          flexDirection: "column",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
=======
          backgroundPosition: "center",
          backgroundSize: "cover",
          flexDirection: "column",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
>>>>>>> emotion
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
<<<<<<< HEAD
            {flashcards.length > 0 && (
              <TinderCard
                flickOnSwipe
                onSwipe={(direction) => {
                  setIsSwiping(true); 
                  onSwipe(direction);
                }}
                onSwipeEnd={() => {
                  setIsSwiping(false);
                }}
                preventSwipe={['bottom']}
                swipeRequirementType="position"
                swipeThreshold={20}
              >
                <Box
                  ref={cardRef}
                  sx={{
                    position: 'relative',
                    width: '500px',
                    height: '500px',
                    perspective: '1000px',
                  }}
                >
                  <Box
                    onClick={handleCardClick}
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.6s',
                    }}
=======
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
>>>>>>> emotion
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backfaceVisibility: 'hidden',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(128, 128, 128, 0.5)',
                        color: 'black',
                        p: 3,
                      }}
                    >
                      {flashcards[currentIndex].front}
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(128, 128, 128, 0.5)',
                        color: 'black',
                        p: 3,
                      }}
                    >
                      {flashcards[currentIndex].back}
                    </Box>
                  </Box>
<<<<<<< HEAD
                </Box>
              </TinderCard>
            )}
=======
                ))}
                <div ref={messagesEndRef} />
              </Stack>
            </TinderCard>
>>>>>>> emotion

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
<<<<<<< HEAD

              <Button 
                variant="contained" 
                onClick={sendMessage} 
                disabled={isLoading} 
                sx={{
                  height: '55px',
                  marginLeft: '5px',
                  border: '1px solid lightgray',
                  textTransform: 'none',
                  color: 'black',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(128, 128, 128, 0.5)',
                  '&:hover': {
                    borderColor: 'black',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                    background: 'rgba(255, 255, 255, 0.8)',
                  }
=======
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
>>>>>>> emotion
                }}
              >
                {isLoading ? "Sending..." : "Send"}
              </Button>
            </Box>

<<<<<<< HEAD
            {isSubscribed && (
              <div className="mt-12"><FacialRecognitionButton /></div>
            )}
=======
            {/* Facial Recognition Button - Only visible if the user is a premium subscriber isSubscribed && */}
            {
              <div className="mt-12">
                <FacialRecognitionButton onCapture={handleCapture} />
              </div>
            }
>>>>>>> emotion
          </Box>
        </Box>
      </Box>
    </>
  );
}
