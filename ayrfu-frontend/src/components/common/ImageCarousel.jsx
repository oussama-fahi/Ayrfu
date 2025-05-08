import React, { useState, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowForwardIos as ArrowForwardIcon, ArrowBackIos as ArrowBackIcon } from '@mui/icons-material';

/**
 * Automatic image carousel with manual navigation controls
 * @param {Array} images - Array of image objects with src, alt, title, and description
 * @param {number} interval - Auto-scroll interval in milliseconds (default: 5000ms)
 * @param {Object} sx - Optional MUI sx prop for additional styling
 * @returns {JSX.Element} The rendered carousel component
 */
const ImageCarousel = ({ images, interval = 5000, sx = {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef(null);

  // Handle automatic scrolling
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, interval, isPaused]);

  const handleNext = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    // Restart interval after manual navigation
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }
  };

  const handlePrev = () => {
    clearInterval(intervalRef.current);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    // Restart interval after manual navigation
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, interval);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 220, sm: 300, md: 350 },
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        ...sx
      }}
      onMouseEnter={() => {
        setIsPaused(true);
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsVisible(false);
      }}
    >
      {/* Carousel images */}
      {images.map((image, index) => (
        <Box
          key={index}
          component="img"
          src={image.src}
          alt={image.alt}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
          }}
        />
      ))}

      {/* Image caption */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 2,
          background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
          color: 'white',
        }}
      >
        <Typography variant="h6">{images[currentIndex]?.title}</Typography>
        <Typography variant="body2">{images[currentIndex]?.description}</Typography>
      </Box>

      {/* Navigation controls - only visible on hover */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 1,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <IconButton
          onClick={handlePrev}
          sx={{
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.3)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>

      {/* Pagination indicators */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 12,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          zIndex: 1,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ImageCarousel;