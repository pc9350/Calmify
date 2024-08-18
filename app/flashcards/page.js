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
  // const [flipped, setFlipped] = useState({});
  const [savedCards, setSavedCards] = useState([
    // {
    //   front: "What is the capital of France?",
    //   back: "Paris",
    // },
    // {
    //   front: "What is 2 + 2?",
    //   back: "4",
    // },
    // {
    //   front: "What is the chemical symbol for water?",
    //   back: "H2O",
    // },
    // {
    //   front: "Who wrote 'To Kill a Mockingbird'?",
    //   back: "Harper Lee",
    // },
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E6E9F0 0%, #EEF1F5 100%)',
        pt: 15,
        pb: 10,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom align="center" sx={{ 
          fontWeight: '300', 
          color: '#34495e',
          mb: 5 
        }}>
          Your Mindful Flashcard Collection
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {savedCards.map((flashcard, index) => (
            <Grid item key={index}>
              <div className="flashcard-book">
                <p className="flashcard-p" style={{ margin: "0 30px" }}>{flashcard.back}</p>
                <div className="flashcard-cover" style={{
                  background: getCalmpGradient(),
                }}>
                  <p className="flashcard-p">{flashcard.front}</p>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function getCalmpGradient() {
  const gradients = [
    'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
    'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
    'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
    'linear-gradient(135deg, #F3E5F5, #E1BEE7)',
    'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
    'linear-gradient(135deg, #F3F4F6, #E5E7EB)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}