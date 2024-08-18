"use client";
import React, { useState } from "react";
import CameraComponent from "../face_recognition/page";

const FacialRecognitionButton = ({ onCapture }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleClick = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleCapture = (result) => {
    if (typeof onCapture === "function") {
      onCapture(result);
    } else {
      console.error("onCapture is not a function");
    }
    handleCloseCamera();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="facial"
      >
        Open Facial Recognition
      </button>
      <CameraComponent
        isOpen={isCameraOpen}
        onClose={handleCloseCamera}
        onCapture={handleCapture}
      />
    </div>
  );
};

export default FacialRecognitionButton;
