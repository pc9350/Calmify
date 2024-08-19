import React, { useRef } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import CloseIcon from "@mui/icons-material/Close";
import InstagramIcon from "@mui/icons-material/Instagram";

const ShareModal = ({ open, handleClose, cardContent, imageUrl }) => {
  const shareToSocial = async (platform) => {
    const text = `Check out this flashcard: ${cardContent.front} - ${cardContent.back}`;
    let url;

    if (!imageUrl || imageUrl === "data:,") {
      console.error("Invalid image URL:", imageUrl);
      alert("Unable to share image. Please try again.");
      return;
    }

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          imageUrl
        )}`; // Only include the image URL in the tweet
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          imageUrl
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          imageUrl
        )}&title=Flashcard&summary=${encodeURIComponent(text)}`;
        break;
      case "instagram":
        try {
          const blob = await fetch(imageUrl).then((r) => r.blob());
          const file = new File([blob], "flashcard.png", { type: "image/png" });
          if (navigator.share) {
            await navigator.share({
              files: [file],
              title: "Flashcard",
              text: text,
            });
          } else {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "flashcard.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert("Image downloaded. You can now share it on Instagram.");
          }
        } catch (error) {
          console.error("Error sharing to Instagram:", error);
          alert("There was an error sharing to Instagram. Please try again.");
        }
        return;
      default:
        return;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "background.paper",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          sx={{ position: "absolute", right: 8, top: 8 }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2" gutterBottom>
          Share this card
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Flashcard"
              style={{ maxWidth: "100%", borderRadius: 4 }}
            />
          ) : (
            <Typography>No image available</Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
          <IconButton onClick={() => shareToSocial("twitter")} color="primary">
            <XIcon />
          </IconButton>
          <IconButton onClick={() => shareToSocial("facebook")} color="primary">
            <FacebookIcon />
          </IconButton>
          <IconButton onClick={() => shareToSocial("linkedin")} color="primary">
            <LinkedInIcon />
          </IconButton>
          <IconButton
            onClick={() => shareToSocial("instagram")}
            color="primary"
          >
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default ShareModal;
