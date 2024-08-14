'use client'

import { useState } from 'react';
import { Container, Box, AppBar, Toolbar, Typography, Button, TextField } from "@mui/material";
import Head from "next/head";
import TinderCard from 'react-tinder-card';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [inputText, setInputText] = useState("");

  const onSwipe = (direction) => {
    console.log('You swiped: ' + direction);
  };

  const onCardLeftScreen = (identifier) => {
    console.log(identifier + ' left the screen');
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Flashcard Saas</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard Saas
          </Typography>
          <SignedOut>
            <Button sx={{ textTransform: 'none', fontSize: '20px' }} color="inherit">Account</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginTop: '20px', width: '100%' }}>
          <TinderCard
            onSwipe={onSwipe}
            onCardLeftScreen={() => onCardLeftScreen('fooBar')}
            preventSwipe={['right', 'left']}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px', width: '500px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
              How Are You Feeling?
            </div>
          </TinderCard>

          <Box width="500px" display="flex" alignItems="center" justifyContent="center" flexDirection="horizontal">
            <TextField
              label="Enter text"
              variant="outlined"
              value={inputText}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginTop: '20px', maxWidth: '600px' }}
            />
            <Button sx={{ height: '55px',marginLeft: '5px', border: '1px solid gray', borderColor: 'black', textTransform: 'none', color: 'gray', borderColor: 'lightgray', display: 'flex', justifyContent: 'center',alignItems: 'center', marginTop: '20px', '&:hover': {borderColor: 'black' }}}>Submit</Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
