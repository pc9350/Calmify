"use client";

import FacialRecognitionButton from "./FacialRecognitionButton";
import { Box, TextField, Button } from "@mui/material";
import TinderCard from "react-tinder-card";
import React, { useState, useRef } from "react";
import Wallpaper from "../../public/landing-background.jpeg";

export default function LandingPage({ isSubscribed }) {
  const [userMessage, setUserMessage] = useState("");
  const [flashcards, setFlashcards] = useState([
    { front: "How are you feeling today?", back: "" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef(null);
  const [capturedValue, setCapturedValue] = useState({});

  const handleCapture = (result) => {
    setCapturedValue(result);
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;
    setIsLoading(true);

    const messageToSend = userMessage;
    setUserMessage("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input:
            messageToSend + "Emotion:" + capturedValue["emotions"][0]["Type"],
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      setFlashcards(data.flashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error("Error:", error);
      setFlashcards([
        {
          front:
            "I'm sorry, but I encountered an error. Please try again later.",
          back: "",
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

  const onSwipe = (direction) => {
    if (direction === "right") {
      setFlashcards((prevCards) => [
        ...prevCards,
        {
          front: `New Flashcard Front ${prevCards.length + 1}`,
          back: `New Flashcard Back ${prevCards.length + 1}`,
        },
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
            marginBottom="100px"
            sx={{ width: "100%" }}
          >
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
                preventSwipe={["bottom"]}
                swipeRequirementType="position"
                swipeThreshold={20}
              >
                <Box
                  ref={cardRef}
                  sx={{
                    position: "relative",
                    width: "500px",
                    height: "500px",
                    perspective: "1000px",
                  }}
                >
                  <Box
                    onClick={handleCardClick}
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
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
