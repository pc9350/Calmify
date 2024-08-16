'use client';

import { Box, AppBar, Toolbar, Typography, Button, TextField } from "@mui/material";
import TinderCard from 'react-tinder-card';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import React, { useState } from 'react';
import Wallpaper from './images/Wallpaper.jpeg';

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
      <Box 
        sx={{ 
          backgroundImage: `url(${Wallpaper.src})`, 
          backgroundPosition: 'center', 
          backgroundSize: 'cover', 
          flexDirection: "column", 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          overflow: "hidden", 
          width: '100vw', 
          height: '100vh' 
        }}
      >
        <AppBar 
          position="absolute"
          sx={{ 
            backgroundColor: 'transparent', 
            boxShadow: 'none' 
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              sx={{ flexGrow: 1 }}
            >
              Calmify
            </Typography>
            <SignedOut>
              <Button sx={{ textTransform: 'none', fontSize: '20px' }} color="inherit">Account</Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box
          sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            width: '100vw',  
          }}
        >
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            marginBottom="100px" 
            sx={{ width: '100%' }}
          >
            <TinderCard 
              flickOnSwipe
              onSwipe={onSwipe}
              onCardLeftScreen={() => onCardLeftScreen('fooBar')}
              preventSwipe={['bottom']}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: '600px', 
                  width: '500px', 
                  maxWidth: '500px', 
                  padding: '20px', 
                  textAlign: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                How Are You Feeling?
              </Box>
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
                label="Enter text"
                variant="outlined"
                value={inputText}
                onChange={handleInputChange}
                fullWidth
                sx={{ 
                  marginTop: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(128, 128, 128, 0.5)', 
                  color: "black",
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'lightgray', 
                    },
                    '&:hover fieldset': {
                      borderColor: 'black',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'black', 
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', 
                    },
                    '& input': {
                      color: 'black',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'gray', 
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'black', 
                  }
                }}
              />
              <Button 
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
                }}
                >
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
