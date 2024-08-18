"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardActionArea,
  Container,
  CardContent,
} from "@mui/material";

export default function SavedCards() {
  const { user } = useUser();
  const [flipped, setFlipped] = useState({});
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
  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

  return (
    <Container maxWidth="md">
      {savedCards.length > 0 && (
        <Box sx={{ mt: 15 }}>
          {/* <Typography variant="h5" gutterBottom align="center">
            Flashcards Preview
          </Typography> */}

          <Grid container spacing={3}>
            {savedCards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <div class="flashcard-book">
                  <p class="flashcard-p">{flashcard.back}</p>
                  <div class="flashcard-cover">
                    <p class="flashcard-p">{flashcard}</p>
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
