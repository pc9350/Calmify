"use client";
import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { db } from "../../firebase";
import { Box, Button, ButtonGroup, Grid } from "@mui/material";

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [emotionResult, setEmotionResult] = useState(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCameraEnabled(false);
  }, [webcamRef]);

  const Popup = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <div className="relative">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-auto rounded-lg"
              ></Webcam>
            </div>
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
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "15vh",

              p: 2, // padding to ensure some space around the buttons on smaller screens
            }}
          ></Box>
        </div>
      </div>
    );
  };

  const handleSave = async () => {
    if (capturedImage) {
      console.log("db object:", db);
      if (!db) {
        console.error("db is undefined");
        return;
      }
      try {
        // const dbRef = ref(db, "images/" + Date.now() + ".jpg");
        // await uploadString(dbRef, capturedImage, "data_url");

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

  const toggleCamera = () => {
    setIsCameraEnabled(!isCameraEnabled);
  };

  return (
    <div>
      <div className="mt-96">
        <button
          onClick={() => {
            openPopup();
            toggleCamera();
          }}
        >
          Open Popup
        </button>
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup}></Popup>
    </div>
  );
};

export default CameraComponent;
