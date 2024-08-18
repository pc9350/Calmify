"use client";

import FacialRecognitionButton from "./FacialRecognitionButton";
import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import Wallpaper from "../../public/landing-background.jpeg";
import TinderCard from "react-tinder-card";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";

export default function LandingPage({ isSubscribed }) {
  const [userMessage, setUserMessage] = useState("");
  const [flashcards, setFlashcards] = useState([
    { front: "How are you feeling today?", back: "How are you feeling today?" },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const { user } = useUser();

  const [capturedValue, setCapturedValue] = useState({
    emotions: [{ Type: "Neutral" }],
  });

  const handleCapture = async (result) => {
    if (result && result.emotions && result.emotions.length > 0) {
      setCapturedValue(result);
      const emotionType = result.emotions[0].Type;

      await sendMessage(emotionType);
    } else {
      console.error("No emotions detected or recognition failed.");
    }
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
    const messageToSend =
      userMessage.trim() === ""
        ? `I am ${String(emotionType).toLowerCase()}`
        : userMessage;

    if (!messageToSend.trim() || isLoading) return;

    setIsLoading(true);

    const messageType = await classifyMessage(messageToSend);

    let response;
    if (messageType === "greeting") {
      setFlashcards([
        {
          front: "Hello! How can I assist you today?",
          back: "Hello! How can I assist you today?",
        },
      ]);
    } else if (messageType === "emotional") {
      response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: `Emotion: ${emotionType}` }),
      });
    } else {
      response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: messageToSend }),
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

  // const onSwipe = (direction) => {
  //   if (direction === "right") {
  //     if (currentIndex < flashcards.length - 1) {
  //       setCurrentIndex(currentIndex + 1);
  //       setIsFlipped(false);
  //     }
  //   }
  // };
  const onSwipe = async (direction) => {
    console.log("Swipe direction:", direction);
    if (direction === "right") {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);

        // Store the current flashcard in the database
        if (user) {
          const userRef = doc(db, "users", user.id);
          try {
            await setDoc(
              userRef,
              {
                savedCards: arrayUnion(flashcards[currentIndex]),
              },
              { merge: true }
            );
            console.log("Card saved successfully");
          } catch (error) {
            console.error("Error saving card: ", error);
          }
        }
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
            {isLoading ? (
              <div className="waiting">
                <div className="🤚">
                  <div className="👉"></div>
                  <div className="👉"></div>
                  <div className="👉"></div>
                  <div className="👉"></div>
                  <div className="🌴"></div>
                  <div className="👍"></div>
                </div>
              </div>
            ) : (
              <div></div>
            )}

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
                      width: "500px",
                      height: "500px",
                      border: "none",
                      borderRadius: "10px",
                      background:
                        "radial-gradient(ellipse farthest-side at 76% 77%, rgba(245, 228, 212, 0.25) 4%, rgba(255, 255, 255, 0) calc(4% + 1px)), radial-gradient(circle at 76% 40%, #fef6ec 4%, rgba(255, 255, 255, 0) 4.18%), linear-gradient(135deg, #ff0000 0%, #000036 100%), radial-gradient(ellipse at 28% 0%, #ffcfac 0%, rgba(98, 149, 144, 0.5) 100%), linear-gradient(180deg, #cd6e8a 0%, #f5eab0 69%, #d6c8a2 70%, #a2758d 100%)",
                      backgroundBlendMode:
                        "normal, normal, screen, overlay, normal",
                      boxShadow: "0px 0px 10px 1px #000000",
                      transformStyle: "preserve-3d",
                      transform: isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                      transition: "transform 0.6s",
                      border: "2px solid pink",
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
              <div
                style={{
                  width: "500px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(to bottom, rgb(227, 213, 255), rgb(255, 231, 231))",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0px 0px 10px 1px #000000",
                    marginTop: "20px",
                    border: "2px solid pink",
                  }}
                >
                  <input
                    style={{
                      width: "97%",
                      height: "35px",
                      border: "none",
                      outline: "none",
                      caretColor: "rgb(255, 81, 0)",
                      backgroundColor: "rgb(255, 255, 255)",
                      borderRadius: "10px",
                      paddingLeft: "15px",
                      letterSpacing: "0.8px",
                      color: "rgb(19, 19, 19)",
                      fontSize: "13.4px",
                      ...(isLoading && {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        cursor: "not-allowed",
                      }),
                    }}
                    placeholder="Message"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    type="text"
                  />
                </div>
              </div>
              <Button
                variant="contained"
                onClick={sendMessage}
                disabled={!userMessage.trim() || isLoading}
                sx={{
                  height: "50px",
                  width: "80px",
                  marginLeft: "5px",
                  marginTop: "20px",
                  textTransform: "none",
                  border: "2px solid pink",
                  outline: "none",
                  color: "rgb(19, 19, 19)",
                  background:
                    "linear-gradient(to bottom, rgb(227, 213, 255), rgb(255, 231, 231))",
                  borderRadius: "10px",
                  paddingLeft: "15px",
                  letterSpacing: "0.8px",
                  fontSize: "13.4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  "&:hover": {
                    backgroundColor: isLoading
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                <Box
                  height="35px"
                  width="60px"
                  border="none"
                  borderRadius="10px"
                  alignItems="center"
                  display="flex"
                  justifyContent="center"
                  backgroundColor="rgba(255, 255, 255, 0.8)"
                  padding="15px"
                >
                  {isLoading ? "Sending..." : "Send"}
                </Box>
              </Button>
            </Box>
            {isSubscribed && (
              <Box
                paddingRight="20px"
                textAlign="cemter"
                display="flex"
                alignItems="center"
                justifyContent="center"
                variant="contained"
                onClick={sendMessage}
                disabled={isLoading}
                sx={{
                  height: "50px",
                  marginLeft: "5px",
                  marginTop: "20px",
                  textTransform: "none",
                  border: "2px solid pink",
                  outline: "none",
                  color: "rgb(19, 19, 19)",
                  backgroundColor: isLoading
                    ? "rgba(255, 255, 255, 0.8)"
                    : "rgb(255, 255, 255)",
                  borderRadius: "10px",
                  paddingLeft: "15px",
                  letterSpacing: "0.8px",
                  fontSize: "13.4px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  "&:hover": {
                    backgroundColor: isLoading
                      ? "rgba(255, 255, 255, 0.8)"
                      : "rgba(255, 255, 255, 0.9)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                }}
              >
                <FacialRecognitionButton onCapture={handleCapture} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
}
