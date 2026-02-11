import React, { useState } from 'react';
import { Backdrop, Box, Button, keyframes } from '@mui/material';

// 1. The Shine Animation
const shimmer = keyframes`
  0% { transform: translateX(-150%) skewX(-30deg); }
  100% { transform: translateX(150%) skewX(-30deg); }
`;

export default function App() {
  const [open, setOpen] = useState(false);

  // A designer "V" path: Sharp, modern, and symmetrical
  const designerVPath = "M20 10 L50 90 L80 10 L65 10 L50 65 L35 10 Z";

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: '#fff' }}>
      
      <Button variant="contained" color="inherit" onClick={() => setOpen(true)}>
        Show Designer V Loader
      </Button>

      <Backdrop
        sx={{ 
          zIndex: 9999, 
          // 0.7 transparency as requested
          backgroundColor: 'rgba(0, 0, 0, 0.7)', 
          // Frosted glass effect
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)', 
        }}
        open={open}
        onClick={() => setOpen(false)}
      >
        <Box sx={{ position: 'relative', width: 140, height: 140 }}>
          
          {/* 1. THE BASE "V" LOGO (Grey/Silver like the previous Apple test) */}
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', fill: '#8e8e93' }}>
            <path d={designerVPath} />
          </svg>

          {/* 2. THE MASKED SHINE LAYER (Locked only to the V shape) */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            maskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${designerVPath}" fill="black" /></svg>')`,
            WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${designerVPath}" fill="black" /></svg>')`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
          }}>
            {/* The Moving White Light Beam */}
            <Box sx={{
              width: '50px',
              height: '100%',
              background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.8), transparent)',
              animation: `${shimmer} 2s infinite ease-in-out`,
            }} />
          </Box>

        </Box>
      </Backdrop>
    </Box>
  );
}
