"use client"
import React, { useState } from 'react';
import CameraComponent from '../face_recognition/page';

const FacialRecognitionButton = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleClick = () => {
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-lime-600 text-white hover:bg-lime-900 transition duration-300 border"
      >
        Open Facial Recognition
      </button>
      <CameraComponent isOpen={isCameraOpen} onClose={handleCloseCamera} />
    </div>
  );
};

export default FacialRecognitionButton;
