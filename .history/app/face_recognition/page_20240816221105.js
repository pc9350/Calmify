"use client";
import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { db } from "../../firebase";
import { Box, Button, ButtonGroup, Grid } from "@mui/material";

const CameraComponent = ({ isOpen, onClose, onCapture }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [emotionResult, setEmotionResult] = useState(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCameraEnabled(false);
  }, [webcamRef]);

  const handleSave = async () => {
    if (capturedImage) {
      console.log("db object:", db);
      if (!db) {
        console.error("db is undefined");
        return;
      }
      try {
        const response = await fetch("/api/emotion_recognition", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: capturedImage }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Emotion detection result:", result);
          setEmotionResult(result);
          onCapture(result);
        } else {
          const errorData = await response.json();
          console.error("Failed to detect emotion:", errorData.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed: " + error.message);
      }
    }
  };

  return (
    isOpen && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <Button>X</Button>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-auto rounded-lg"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2, // Add margin top
            }}
          >
            <Grid container justifyContent="center">
              <ButtonGroup variant="contained" aria-label="Basic button group">
                <Button onClick={capture} color="secondary">
                  Capture photo
                </Button>
                {capturedImage && (
                  <Button
                    onClick={() => {
                      handleSave();
                      onClose();
                    }}
                    color="primary"
                    variant="outlined"
                  >
                    Save & Close
                  </Button>
                )}
              </ButtonGroup>
            </Grid>
          </Box>
        </div>
      </div>
    )
  );
};

export default CameraComponent;
