"use client"
import React from 'react';

const FacialRecognitionButton = () => {
 

  const handleClick = () => {
    // Logic to open the facial recognition feature
    console.log("Facial Recognition feature opened.");
    // You can replace this with the actual function to open the feature
  };

  return (
    <button
      onClick={handleClick}
      className="facial"
    >
      Open Facial Recognition
    </button>
  );
};

export default FacialRecognitionButton;
