"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Box, Grid, Typography, Container } from "@mui/material";

export default function SavedCards() {
  const { user } = useUser();
  const [savedCards, setSavedCards] = useState([
    {
      front: "What is the capital of France?",
      back: "Paris",
    },
    {
      front: "What is 2 + 2?",
      back: "4",
    },
    {
      front: "What is the chemical symbol for water?",
      back: "H2O",
    },
    {
      front: "Who wrote 'To Kill a Mockingbird'?",
      back: "Harper Lee",
    },
  ]);

  useEffect(() => {
    const fetchSavedCards = async () => {
      if (user) {
        const userRef = doc(db, "users", user.id);
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setSavedCards(docSnap.data().savedCards || []);
          }
        } catch (error) {
          console.error("Error fetching saved cards: ", error);
        }
      }
    };

    fetchSavedCards();
  }, [user]);

  const flashcardStyle = {
    width: "100%",
    height: "200px",
    perspective: "1000px",
    cursor: "pointer",
  };

  const flashcardInnerStyle = {
    position: "relative",
    width: "100%",
    height: "100%",
    textAlign: "center",
    transition: "transform 0.6s",
    transformStyle: "preserve-3d",
  };

  const flashcardFaceStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  };

  const flashcardFrontStyle = {
    ...flashcardFaceStyle,
    backgroundColor: "#f0f0f0",
    color: "#333",
  };

  const flashcardBackStyle = {
    ...flashcardFaceStyle,
    backgroundColor: "#3f51b5",
    color: "white",
    transform: "rotateY(180deg)",
  };

  return (
    <Container maxWidth="md">
      {savedCards.length > 0 && (
        <Box sx={{ mt: 15 }}>
          <Grid container spacing={3}>
            {savedCards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div style={flashcardStyle}>
                  <div style={flashcardInnerStyle}>
                    <div style={flashcardFrontStyle}>
                      <Typography variant="body1">{flashcard.front}</Typography>
                    </div>
                    <div style={flashcardBackStyle}>
                      <Typography variant="body1">{flashcard.back}</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
