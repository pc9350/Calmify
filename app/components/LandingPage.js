"use client";

import FacialRecognitionButton from "./FacialRecognitionButton";
import {
  Box,
  Button,
  useMediaQuery,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import React, { useState } from "react";
import Wallpaper from "../../public/landing-background.jpeg";
import TinderCard from "react-tinder-card";
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebase";
import { useUser } from "@clerk/nextjs";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 500,
      color: "#333",
    },
    body1: {
      fontSize: "1rem",
      color: "#666",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function LandingPage({ isSubscribed }) {
  const [isExiting, setIsExiting] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [flashcards, setFlashcards] = useState([
    { front: "How are you feeling today?", back: "(^!^)", isFlipped: false },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const { user } = useUser();
  const [isSwiped, setIsSwiped] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isDefaultFlashcards = () => {
    return (
      flashcards.length === 1 &&
      flashcards[0].front === "How are you feeling today?"
    );
  };

  const resetToDefaultFlashcards = () => {
    console.log("Resetting to default flashcards");
    setFlashcards([
      { front: "How are you feeling today?", back: "(^!^)", isFlipped: false },
    ]);
    setCurrentIndex(0);

    setIsExiting(false);

    setTimeout(() => {
      setFlashcards((prevFlashcards) => [...prevFlashcards]);
    }, 0);
  };

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

  const classNameifyMessage = async (message) => {
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

    const messageType = await classNameifyMessage(messageToSend);

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
    if (data.flashcards.length === 0) {
      console.log("No flashcards received, resetting to default");
      resetToDefaultFlashcards();
    } else {
      console.log("Received flashcards:", data.flashcards);
      setFlashcards(
        data.flashcards.map((card) => ({ ...card, isFlipped: false }))
      );
      setCurrentIndex(0);
      setIsFlipped(false);
    }
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
    if (isDefaultFlashcards()) return;
    setIsExiting(true);

    const isLastCard = currentIndex >= flashcards.length - 1;
    const isSingleCardResponse =
      flashcards.length === 1 && !isDefaultFlashcards();

    if (direction === "right" && !isLastCard) {
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setIsExiting(false);
      }, 800);

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
    } else if (!isLastCard) {
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setIsExiting(false);
      }, 800);
    }

    if (isLastCard || isSingleCardResponse) {
      setTimeout(() => {
        resetToDefaultFlashcards();
        setIsExiting(false);
      }, 800);
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
      setFlashcards((prevCards) =>
        prevCards.map((card, index) =>
          index === currentIndex
            ? { ...card, isFlipped: !card.isFlipped }
            : card
        )
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #e0f2f1 0%, #e1bee7 100%)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
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
              <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]"></div>
                <br></br>
                <br></br>
              </div>
            ) : (
              <div></div>
            )}

            {
              <TinderCard
                key={`card-${currentIndex}-${flashcards[currentIndex]?.front}`}
                flickOnSwipe
                onSwipe={onSwipe}
                onSwipeStart={handleSwipeStart}
                onSwipeEnd={handleSwipeEnd}
                preventSwipe={
                  isDefaultFlashcards()
                    ? ["left", "right", "up", "bottom"]
                    : ["up", "bottom"]
                }
                swipeRequirementType="position"
                swipeThreshold={20}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "500px",
                    height: "500px",
                    opacity: isDefaultFlashcards() ? 0.5 : 1,
                    cursor: isDefaultFlashcards() ? "not-allowed" : "grab",
                    transition:
                      "opacity 1.2s ease-in-out, transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    transform: isExiting
                      ? "translateX(calc(100vw + 500px))" // Move the card off-screen to the right
                      : "translateX(0)",
                    overflow: "visible",
                    animation: isExiting ? "none" : "slideIn 0.7s ease-out",
                    "@keyframes slideIn": {
                      from: {
                        transform: "translateX(calc(-100vw - 500px))",
                        opacity: 0,
                      },
                      to: { transform: "translateX(0)", opacity: 1 },
                    },
                  }}
                >
                  <Box
                    onClick={handleCardClick}
                    sx={{
                      width: "500px",
                      height: "500px",
                      border: "none",
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255, 0.8)",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                      transformStyle: "preserve-3d",
                      transform: flashcards[currentIndex].isFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                      transition:
                        "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.8s ease-in-out",
                      opacity: isExiting ? 0 : 1,
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
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "20px",
                        padding: "2rem",
                        fontSize: "1.2rem",
                        lineHeight: 1.6,
                        color: "#333",
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
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "20px",
                        padding: "2rem",
                        fontSize: "1.2rem",
                        lineHeight: 1.6,
                        color: "#333",
                      }}
                    >
                      {flashcards[currentIndex].back}
                    </Box>
                  </Box>
                </Box>
              </TinderCard>
            }

            <Box
              width="100%"
              maxWidth="500px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="row"
              mt={4}
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
                    background: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "25px",
                    overflow: "hidden",
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                    marginTop: "20px",
                  }}
                >
                  <input
                    style={{
                      width: "97%",
                      height: "100%",
                      border: "none",
                      outline: "none",
                      caretColor: "rgb(255, 81, 0)",
                      backgroundColor: "transparent",
                      paddingLeft: "20px",
                      letterSpacing: "0.8px",
                      color: "rgb(19, 19, 19)",
                      fontSize: "16px",
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
                  marginLeft: "10px",
                  marginTop: "20px",
                  textTransform: "none",
                  borderRadius: "25px",
                  padding: "0 20px",
                  fontSize: "16px",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  color: "rgb(19, 19, 19)",
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                  },
                }}
              >
                {isLoading ? "Sending..." : "Send"}
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
    </ThemeProvider>
  );
}
